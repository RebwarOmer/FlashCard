const pool = require("../db");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailSender");

const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    // Check if user exists and is not verified
    const user = await pool.query(
      "SELECT userid, name, is_verified FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Email not found." });
    }

    if (user.rows[0].is_verified) {
      return res.status(400).json({ error: "Account is already verified." });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Update user with new token
    await pool.query(
      "UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE userid = $3",
      [verificationToken, verificationTokenExpires, user.rows[0].userid]
    );

    // Send verification email
    await sendVerificationEmail(email, user.rows[0].name, verificationToken);

    res.status(200).json({
      message:
        "Verification email resent successfully. Please check your email.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "Failed to resend verification email." });
  }
};

module.exports = resendVerification;
