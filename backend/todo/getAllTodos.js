const pool = require("../db");

const getAllTodos = async (req, res) => {
  try {
    const { userId } = req.user; // Extract userId from authMiddleware
    const todos = await pool.query(
      "SELECT * FROM todo WHERE userId = $1 ORDER BY createdAt ASC",
      [userId]
    );
    res.json(todos.rows); // send to frontedn
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getAllTodos;
