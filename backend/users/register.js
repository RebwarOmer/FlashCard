const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailSender");

const register = async (req, res) => {
  const { Name, Email, Password } = req.body;

  if (!Name || !Email || !Password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (Password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
  }

  if (!/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const existingUser = await pool.query(
      "SELECT userid FROM users WHERE email = $1",
      [Email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO users (name, email, passwordhash, verification_token, verification_token_expires, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING userid, email, name`,
      [
        Name,
        Email,
        hashedPassword,
        verificationToken,
        verificationTokenExpires,
        false,
      ]
    );

    await sendVerificationEmail(Email, Name, verificationToken);

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
      email: result.rows[0].email,
      name: result.rows[0].name,
      verified: false,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

module.exports = register;
