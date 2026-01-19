const pool = require("../db");

const updateSet = async (req, res) => {
  try {
    const { setName } = req.body;
    const { setid } = req.params;

    const updatedSet = await pool.query(
      "UPDATE sets SET setName = COALESCE($1, setName), updatedAt = NOW() WHERE setId = $2 RETURNING *",
      [setName, setid]
    );

    if (updatedSet.rows.length === 0) {
      return res.status(404).json({ error: "Set not found" });
    }

    res.json(updatedSet.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = updateSet;
