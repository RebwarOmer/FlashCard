const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { updateStreak } = require("../users/streak"); // Import the updateStreak function

const createTodo = require("../todo/createTodo");
const getAllTodos = require("../todo/getAllTodos");
const updateTodo = require("../todo/updateTodo");
const deleteTodo = require("../todo/deleteTodo");

// Create Todo (Updates Streak)
router.post("/createTodo", authMiddleware, async (req, res) => {
  try {
    await createTodo(req, res); // Call original function

    const userId = req.user.userId;
    const result = await updateStreak(userId);
    console.log("Updated streak:", result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Get All Todos (NO STREAK UPDATE)
router.get("/getAllTodos", authMiddleware, getAllTodos);

// Update Todo (Updates Streak)
router.put("/updateTodo/:id", authMiddleware, async (req, res) => {
  try {
    await updateTodo(req, res); // Call original function
    const userId = req.user.userId;
    await updateStreak(userId); // ✅ Update streak
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete Todo (Updates Streak)
router.delete("/deleteTodo/:id", authMiddleware, async (req, res) => {
  try {
    await deleteTodo(req, res); // Call original function

    const userId = req.user.userId;
    await updateStreak(userId); // ✅ Update streak
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
