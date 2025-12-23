const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "SECRET_KEY");

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // ✅ attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
