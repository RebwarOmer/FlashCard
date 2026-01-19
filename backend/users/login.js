const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const login = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email) {
    return res.status(400).json({ error: "Email is required." });
  }
  if (!Password) {
    return res.status(400).json({ error: "Password is required." });
  }

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      Email,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if email is verified
    if (!user.rows[0].is_verified) {
      return res.status(403).json({
        error:
          "Email not verified. Please check your email for verification link.",
        needsVerification: true,
        email: user.rows[0].email,
      });
    }

    const validPassword = await bcrypt.compare(
      Password,
      user.rows[0].passwordhash
    );

    console.log("Password match result:", validPassword); // Add this

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Add temporary debug logging:
    console.log("User found:", {
      id: user.rows[0]?.userid,
      is_verified: user.rows[0]?.is_verified,
      hasPassword: !!user.rows[0]?.passwordhash,
    });

    const token = jwt.sign(
      { userId: user.rows[0].userid },
      process.env.JWT_SECRET, // Confirm this exists!
      { expiresIn: "1d" }
    );
    console.log("Generated token:", token);

    let profilePictureUrl = user.rows[0].profilepictureurl;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      Name: user.rows[0].name,
      ProfilePictureUrl: profilePictureUrl || "../uploads/user.png",
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = login;
