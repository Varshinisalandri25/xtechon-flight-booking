const User = require("./User");
const Flight = require("./Flight");
const Booking = require("./Booking");
const Wallet = require("./Wallet");


// User ↔ Wallet
User.hasOne(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Booking, { foreignKey: "userId" });
Booking.belongsTo(User, { foreignKey: "userId" });

Flight.hasMany(Booking, { foreignKey: "flightId" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });


// Flight ↔ Booking
Flight.hasMany(Booking, { foreignKey: "flightId" });
Booking.belongsTo(Flight, { foreignKey: "flightId" });

module.exports = {
  User,
  Flight,
  Booking,
  Wallet,
};
