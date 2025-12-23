const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

const { User, Flight, Booking, Wallet } = require("./models");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const generateTicket = require("./utils/generateTicket");

const app = express();

/* 🔥 PNR GENERATOR */
const generatePNR = () =>
  "XTCH-" + Math.random().toString(36).substring(2, 8).toUpperCase();

/* =====================
   MODEL ASSOCIATIONS
===================== */
User.hasOne(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Flight.hasMany(Booking, { foreignKey: "flightId" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });

/* =====================
   MIDDLEWARE
===================== */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

/* =====================
   HEALTH CHECK
===================== */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* =====================
   AUTH
===================== */
app.use("/api/auth", authRoutes);

/* =====================
   FLIGHTS
===================== */
app.get("/api/flights", async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch {
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

/* =====================
   WALLET
===================== */
app.get("/api/wallet", authMiddleware, async (req, res) => {
  const wallet = await Wallet.findOne({
    where: { userId: req.userId },
  });

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  res.json({ balance: wallet.balance });
});

/* =====================
   MY BOOKINGS
===================== */
app.get("/api/my-bookings", authMiddleware, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.userId },
    include: [{ model: Flight }],
    order: [["createdAt", "DESC"]],
  });

  res.json(bookings);
});

/* =====================
   BOOK FLIGHT ✅ FINAL FIX
===================== */
app.post("/api/book", authMiddleware, async (req, res) => {
  try {
    const { flightId, seats = 1 } = req.body;

    const flight = await Flight.findByPk(flightId);
    if (!flight) return res.status(404).json({ error: "Flight not found" });

    const wallet = await Wallet.findOne({
      where: { userId: req.userId },
    });

    if (!wallet || wallet.balance < flight.currentPrice) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    const user = await User.findByPk(req.userId);

    const booking = await Booking.create({
      userId: req.userId,
      flightId,
      seats,
      pricePaid: flight.currentPrice,
      passengerName: user.name,
      passengerEmail: user.email,
      pnr: generatePNR(), // ✅ REQUIRED
    });

    wallet.balance -= flight.currentPrice;
    await wallet.save();

    flight.currentPrice += 200;
    await flight.save();

    res.json({
      message: "Booking successful",
      booking,
      remainingBalance: wallet.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

/* =====================
   CANCEL BOOKING
===================== */
app.delete("/api/book/:id", authMiddleware, async (req, res) => {
  const booking = await Booking.findOne({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const wallet = await Wallet.findOne({
    where: { userId: req.userId },
  });

  wallet.balance += booking.pricePaid;
  await wallet.save();

  await booking.destroy();

  res.json({
    message: "Booking cancelled & refunded",
    balance: wallet.balance,
  });
});

/* =====================
   DOWNLOAD TICKET
===================== */
app.get("/api/ticket/:bookingId", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.bookingId,
        userId: req.userId,
      },
      include: [Flight],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    generateTicket(res, booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate ticket" });
  }
});

/* =====================
   START SERVER
===================== */
const PORT = 5000;
app.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log("Server running on port", PORT);
});
