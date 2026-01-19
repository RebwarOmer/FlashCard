const pool = require("../db");

const updateTodo = async (req, res) => {
  try {
    const { task, completed } = req.body;
    const { id } = req.params;

    const updatedTodo = await pool.query(
      "UPDATE todo SET task = COALESCE($1, task), completed = COALESCE($2, completed), updatedat = NOW() WHERE id = $3 RETURNING *",
      [task, completed, id]
    );

    if (updatedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = updateTodo;
