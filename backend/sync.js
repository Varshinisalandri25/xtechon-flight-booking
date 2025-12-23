const sequelize = require("./config/database");
require("./models/User");
require("./models/Wallet");
require("./models/Booking");
require("./models/Flight");

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Tables synced successfully");
    process.exit(0);
  } catch (err) {
    console.error("Sync failed:", err);
    process.exit(1);
  }
})();
