const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
  passengerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passengerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  seats: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  pricePaid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  pnr: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
},


  // 🔑 Foreign Keys (IMPORTANT)
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  flightId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Booking;
