const sequelize = require("./config/database");
const Flight = require("./models/Flight");

const flights = [
  {
    airline: "Air India",
    source: "Hyderabad",
    destination: "Delhi",
    basePrice: 5000,
    currentPrice: 5000,
  },
  {
    airline: "IndiGo",
    source: "Hyderabad",
    destination: "Bangalore",
    basePrice: 5000,
    currentPrice: 5000,
  },
];

(async () => {
  try {
    await sequelize.sync();
    await Flight.bulkCreate(flights);
    console.log("Flights seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();
