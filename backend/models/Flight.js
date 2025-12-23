const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Flight = sequelize.define("Flight", {
  airline: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  basePrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currentPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  bookingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastBookedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  /* ✅ NEW (OPTIONAL — SAFE) */
  departureDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  departureTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Flight;
