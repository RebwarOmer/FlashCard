const pool = require("../db");

const updateCard = async (req, res) => {
  try {
    const { cardid } = req.params;

    const { frontcontent, backcontent } = req.body;

    if (!cardid || !frontcontent || !backcontent) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedCard = await pool.query(
      `UPDATE cards 
       SET frontcontent = $1, backcontent = $2, updatedat = CURRENT_TIMESTAMP
       WHERE cardid = $3 RETURNING *`,
      [frontcontent, backcontent, cardid]
    );

    if (updatedCard.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(200).json(updatedCard.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = updateCard;
