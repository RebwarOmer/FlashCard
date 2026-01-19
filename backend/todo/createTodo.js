const pool = require("../db"); // Import the pool object

const createTodo = async (req, res) => {
  try {
    const { task } = req.body; //from frontend
    const { userId } = req.user; //from token

    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const newTodo = await pool.query(
      "INSERT INTO todo (task, userid) VALUES ($1, $2) RETURNING *",
      [task, userId]
    );

    console.log(newTodo.rows[0]);

    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = createTodo; // Make sure you are exporting the function
