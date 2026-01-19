const pool = require("../db");

const getAllSets = async (req, res) => {
  try {
    const { userId } = req.user; // Extract userId from token

    const sets = await pool.query(
      `
      SELECT 
        s.*, 
        COUNT(c.cardid) AS card_count
      FROM sets s
      LEFT JOIN cards c ON c.setid = s.setid
      WHERE s.userid = $1
      GROUP BY s.setid
      ORDER BY s.createdat ASC
      `,
      [userId]
    );

    res.json(sets.rows);
    console.log(sets.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getAllSets;
