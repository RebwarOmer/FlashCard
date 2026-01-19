const pool = require("../db"); // Import the pool object

const createSet = async (req, res) => {
  try {
    const { setName } = req.body; //set id
    const { userId } = req.user; //from token

    if (!setName) {
      return res.status(400).json({ error: "Set name  are required" });
    }

    const newSet = await pool.query(
      "INSERT INTO sets (setName, userId) VALUES ($1, $2) RETURNING setid",
      [setName, userId]
    );

    res.status(201).json({ setid: newSet.rows[0].setid }); // Ensure correct response structure
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = createSet;
