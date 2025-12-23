const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Wallet = sequelize.define("Wallet", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50000,
  },
});

module.exports = Wallet;
