const pool = require("../db");

const createCard = async (req, res) => {
  try {
    const { setid, frontcontent, backcontent } = req.body;

    if (!setid || !frontcontent || !backcontent) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCard = await pool.query(
      `INSERT INTO cards (setid, frontcontent, backcontent) 
       VALUES ($1, $2, $3) RETURNING *`,
      [setid, frontcontent, backcontent]
    );

    res.status(201).json(newCard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = createCard;
