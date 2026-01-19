const pool = require("../db");

const deleteCard = async (req, res) => {
  try {
    const { cardid } = req.params;
    if (!cardid) {
      return res.status(400).json({ error: "Card ID is required" });
    }

    const deletedCard = await pool.query(
      "DELETE FROM cards WHERE cardid = $1 RETURNING *",
      [cardid]
    );

    if (deletedCard.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = deleteCard;
