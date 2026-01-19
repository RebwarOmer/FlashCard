const fs = require("fs").promises;
const path = require("path");
const pool = require("../db");

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(403).json({ error: "Invalid user." });
    }

    const userResult = await pool.query(
      "SELECT ProfilePictureUrl FROM Users WHERE UserID = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const profilePictureUrl = userResult.rows[0].profilepictureurl;

    const result = await pool.query(
      "DELETE FROM Users WHERE UserID = $1 RETURNING UserID",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete profile picture if it's not the default image
    if (
      typeof profilePictureUrl === "string" &&
      profilePictureUrl !== "../uploads/user.png"
    ) {
      const filePath = path.resolve(
        __dirname,
        "..",
        "uploads",
        path.basename(profilePictureUrl)
      );
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log("File deleted:", filePath);
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log("File does not exist, skipping deletion.");
        } else {
          console.error("Error deleting file:", err);
        }
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Error deleting account:", err.message);
    res.status(500).json({ error: "Failed to delete account." });
  }
};

module.exports = deleteAccount;
