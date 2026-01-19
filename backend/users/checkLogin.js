const pool = require("../db");

const checkLogin = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: No user found" });
  }

  try {
    const user = await pool.query(
      "SELECT profilepictureurl ,name,email , purposeofuse,age FROM users WHERE userid = $1",
      [req.user.userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      isLoggedIn: true,
      Name: user.rows[0].name,
      Email: user.rows[0].email,
      Age: user.rows[0].age,
      PurposeOfUse: user.rows[0].purposeofuse,
      profilePictureUrl:
        user.rows[0].profilepictureurl ||
        "http://localhost:5000/uploads/user.png",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = checkLogin; // ✅ Protect the route
