// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 🛡️ Check for token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔐 Fetch user from DB and attach to request
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // ✅ So you can access req.user in route
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
