const pool = require("../db");

const deleteSet = async (req, res) => {
  try {
    const { setid } = req.params;

    const deletedSet = await pool.query(
      "DELETE FROM sets WHERE setId = $1 RETURNING *",
      [setid]
    );

    if (deletedSet.rows.length === 0) {
      return res.status(404).json({ error: "Set not found" });
    }

    res.status(200).json({ message: "Set deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = deleteSet;
