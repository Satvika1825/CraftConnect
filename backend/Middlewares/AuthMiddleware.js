const jwt = require("jsonwebtoken");
const userModel = require("../Models/UserModel");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.isBanned) return res.status(403).json({ message: "User is banned" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// role-based middleware (example for admin)
const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};

module.exports = { protect, adminOnly };
