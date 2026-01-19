const multer = require("multer");
const pool = require("../db");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const profileSetup = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User is not logged in." });
  }

  const userId = req.user.userId;

  try {
    const { age, purposeOfUse } = req.body;
    if (!age || !purposeOfUse) {
      return res
        .status(400)
        .json({ error: "Age and Purpose of Use are required." });
    }

    let profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `UPDATE Users
       SET Age = $1, PurposeOfUse = $2, ProfilePictureUrl = $3
       WHERE UserID = $4
       RETURNING *`,
      [age, purposeOfUse, profilePictureUrl, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found or failed to update." });
    }

    res.json({
      message: "Profile updated successfully.",
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

module.exports = { profileSetup, upload };
