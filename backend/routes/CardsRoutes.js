const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { updateStreak } = require("../users/streak"); // Import the updateStreak function

const createCard = require("../Cards/createCard");
const getAllCards = require("../Cards/getAllCards");
const updateCard = require("../Cards/updateCard");
const deleteCard = require("../Cards/deleteCard");

// Create Todo (Updates Streak)
router.post("/createCard", authMiddleware, async (req, res) => {
  try {
    await createCard(req, res); // Call original function

    const userId = req.user.userId; // Get user ID from middleware
    await updateStreak(userId);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Get All Todos (NO STREAK UPDATE)
router.get("/getAllCards/:setid", authMiddleware, getAllCards);

// Update Todo (Updates Streak)
router.put("/updateCard/:cardid", authMiddleware, async (req, res) => {
  try {
    await updateCard(req, res); // Call original function

    const userId = req.user.userId;
    await updateStreak(userId); // ✅ Update streak
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete Todo (Updates Streak)
router.delete("/deleteCard/:cardid", authMiddleware, async (req, res) => {
  try {
    await deleteCard(req, res); // Call original function

    const userId = req.user.userId;
    await updateStreak(userId); // ✅ Update streak
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
