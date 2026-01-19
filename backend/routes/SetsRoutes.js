const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { updateStreak } = require("../users/streak");
const createSet = require("../Sets/createSet");
const getAllSets = require("../Sets/getAllSets");
const updateSet = require("../Sets/updateSet");
const deleteSet = require("../Sets/deleteSet");

// Create Set (Updates Streak)
router.post("/createSet", authMiddleware, async (req, res) => {
  try {
    await createSet(req, res); // Call original function

    const userId = req.user.userId;
    const result = await updateStreak(userId);
    console.log("Updated streak:", result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create set" });
  }
});

// Get All Sets (NO Streak Update)
router.get("/getAllSets", authMiddleware, getAllSets);

// Update Set (Updates Streak)
router.put("/updateSet/:setid", authMiddleware, async (req, res) => {
  try {
    await updateSet(req, res);

    const userId = req.user.userId;
    await updateStreak(userId); // ✅ Update streak
  } catch (error) {
    res.status(500).json({ error: "Failed to update set" });
  }
});

// Delete Set (Updates Streak)
router.delete("/deleteSet/:setid", authMiddleware, async (req, res) => {
  try {
    await deleteSet(req, res);

    const userId = req.user.userId;
    await updateStreak(userId); // ✅ Update streak
  } catch (error) {
    res.status(500).json({ error: "Failed to delete set" });
  }
});

// Get Set Name (NO Streak Update)

module.exports = router;
