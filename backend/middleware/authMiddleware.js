const jwt = require("jsonwebtoken");
const pool = require("../db");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Not authorized, no token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const { rows } = await pool.query(
      "SELECT userid, is_verified FROM users WHERE userid = $1",
      [decoded.userId] // Make sure your token payload uses "userId", not "userid"
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        error: "Email not verified. Please verify your email first.",
        needsVerification: true,
      });
    }

    // Attach user info to request
    req.user = { userId: user.userid };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.name, err.message);

    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session expired. Please login again." });
    }

    if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: "Invalid token. Please login again." });
    }

    res.status(500).json({ error: "Internal authentication error." });
  }
};

module.exports = authMiddleware;
