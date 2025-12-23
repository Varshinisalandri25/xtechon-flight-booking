const sequelize = require("./config/database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log(" MySQL connected successfully");
    process.exit(0);
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
})();
