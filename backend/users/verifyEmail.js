const pool = require("../db");
const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token is required." });
  }

  try {
    const result = await pool.query(
      "SELECT userid, email, name, verification_token_expires FROM users WHERE verification_token = $1 AND is_verified = false",
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error:
          "Invalid or expired verification token. Please request a new one.",
      });
    }

    const user = result.rows[0];
    const now = new Date();

    if (now > user.verification_token_expires) {
      return res.status(400).json({
        error: "Verification token has expired. Please request a new one.",
      });
    }

    // Mark as verified
    await pool.query(
      "UPDATE users SET is_verified = true, verification_token = NULL, verification_token_expires = NULL WHERE userid = $1",
      [user.userid]
    );

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user.userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Email verified and login successful!",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Email verification error:", err);
    res
      .status(500)
      .json({ error: "Email verification failed. Please try again." });
  }
};

module.exports = verifyEmail;
