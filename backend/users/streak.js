const pool = require("../db");
const moment = require("moment");

const updateStreak = async (userId) => {
  const now = moment();
  const today = now.format("YYYY-MM-DD");

  try {
    // 1. Fetch user's current streak data
    const { rows } = await pool.query(
      `SELECT streak_count, last_streak_date 
       FROM users 
       WHERE userid = $1`,
      [userId]
    );

    if (rows.length === 0) return { error: "User not found" };

    const { streak_count, last_streak_date } = rows[0];
    let newStreakCount = streak_count;
    let shouldUpdate = false;

    // 2. If first time or never updated
    if (!last_streak_date) {
      newStreakCount = 1;
      shouldUpdate = true;
    }
    // 3. If already updated today → do nothing
    else if (moment(last_streak_date).isSame(today, "day")) {
      shouldUpdate = false;
      console.log("Already updated today. No change.");
    }
    // 4. If last update was yesterday → increase streak
    else if (
      moment(last_streak_date).isSame(moment().subtract(1, "day"), "day")
    ) {
      newStreakCount = streak_count + 1;
      shouldUpdate = true;
    }
    // 5. If missed a day → reset streak to 0
    else {
      newStreakCount = 0;
      shouldUpdate = true;
    }

    // 6. Update database if needed
    if (shouldUpdate) {
      await pool.query(
        `UPDATE users 
         SET streak_count = $1, last_streak_date = $2 
         WHERE userid = $3`,
        [newStreakCount, today, userId]
      );
    }
  } catch (error) {
    console.error("Error updating streak:", error);
    throw error;
  }
};
const getStreak = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.userId;

  try {
    const streak = await pool.query(
      "SELECT streak_count, last_streak_date FROM users WHERE userid = $1",
      [userId]
    );

    if (streak.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const { streak_count, last_streak_date } = streak.rows[0];

    res.status(200).json({
      streak_count,
      streak_date: last_streak_date || null, // Ensure we send a valid date or null
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { updateStreak, getStreak };
