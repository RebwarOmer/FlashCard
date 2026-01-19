const fs = require("fs").promises;
const path = require("path");
const pool = require("../db");

const editUserInfo = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User is not logged in." });
  }

  const { name, age, purposeOfUse } = req.body;
  const DEFAULT_PROFILE_PICTURE = "http://localhost:5000/uploads/user.png";
  let profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Get the current profile picture from the database
    const userResult = await pool.query(
      "SELECT ProfilePictureUrl FROM Users WHERE UserID = $1",
      [req.user.userId]
    );

    if (userResult.rows.length > 0) {
      const oldProfilePicture = userResult.rows[0].profilepictureurl;

      // Only update the profile picture if a new one is uploaded
      if (
        profilePictureUrl &&
        oldProfilePicture &&
        profilePictureUrl !== oldProfilePicture
      ) {
        // Delete the old profile picture if it's not the default image
        if (
          oldProfilePicture &&
          oldProfilePicture !== DEFAULT_PROFILE_PICTURE
        ) {
          try {
            const oldImagePath = path.join(
              __dirname,
              "..",
              "uploads",
              path.basename(oldProfilePicture)
            );
            await fs.access(oldImagePath);
            await fs.unlink(oldImagePath);
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.error("Error deleting old profile picture:", err);
            }
          }
        }
      } else {
        // If no new image is provided, use the existing one or default
        profilePictureUrl = oldProfilePicture || DEFAULT_PROFILE_PICTURE;
      }
    } else {
      // If no user is found, use the default image
      profilePictureUrl = DEFAULT_PROFILE_PICTURE;
    }

    // Validate and parse the age field
    const ageValue =
      age !== undefined && age !== null && age !== "" && !isNaN(age)
        ? parseInt(age, 10)
        : null;

    const result = await pool.query(
      `
      UPDATE Users
      SET 
          Name = COALESCE($1, Name), 
          Age = COALESCE($2, Age), 
          PurposeOfUse = COALESCE($3, PurposeOfUse),
          ProfilePictureUrl = COALESCE($4, ProfilePictureUrl)
      WHERE UserID = $5
      RETURNING Name, Age, PurposeOfUse, ProfilePictureUrl;
      `,
      [
        name || null,
        ageValue,
        purposeOfUse || null,
        profilePictureUrl,
        req.user.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "User not found or failed to update." });
    }

    const updatedUser = result.rows[0];

    res.json({
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user info:", err.message);
    res.status(500).json({ error: "Failed to update user info." });
  }
};

module.exports = editUserInfo;
