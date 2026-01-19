const pool = require("../db");

const getAllCards = async (req, res) => {
  try {
    const { setid } = req.params;

    if (!setid) {
      return res.status(400).json({ error: "Set ID is required" });
    }

    // Get set name and cards using JOIN
    const result = await pool.query(
      `
      SELECT s.setname, c.*
      FROM sets s
      LEFT JOIN cards c ON c.setid = s.setid
      WHERE s.setid = $1
      `,
      [setid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Set not found" });
    }

    // Separate set name and cards
    const setName = result.rows[0].setname;
    const cards = result.rows.map((row) => {
      const { setname, ...card } = row; // Destructure to separate setname
      return card; // Return card info
    });

    res.status(200).json({ setName, cards });
  } catch (err) {
    console.error("Error fetching cards:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getAllCards;
