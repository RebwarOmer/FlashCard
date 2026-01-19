const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { updateStreak } = require("../users/streak");
const pool = require("../db");

// Start a new quiz session
router.post("/quiz/start", authMiddleware, async (req, res) => {
  try {
    const { setid } = req.body;
    const userId = req.user.userId;

    // Create a new quiz session
    const newSession = await pool.query(
      "INSERT INTO QuizSessions (userId, setId) VALUES ($1, $2) RETURNING *",
      [userId, setid]
    );

    // Get random cards from the set
    const cards = await pool.query(
      "SELECT * FROM Cards WHERE setId = $1 ORDER BY RANDOM() LIMIT 10",
      [setid]
    );

    res.json({
      session: newSession.rows[0],
      cards: cards.rows,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Submit quiz response
router.post("/quiz/response", authMiddleware, async (req, res) => {
  try {
    const { sessionId, cardId, isCorrect } = req.body;
    const userId = req.user.userId;

    // Update card progress (Spaced Repetition Algorithm - SM-2)
    const progress = await pool.query(
      "SELECT * FROM CardProgress WHERE userId = $1 AND cardId = $2",
      [userId, cardId]
    );

    let easeFactor, interval, nextReviewDate;
    const now = new Date();

    if (progress.rows.length === 0) {
      // First time seeing this card
      easeFactor = 2.5;
      interval = isCorrect ? 1 : 0; // 1 day if correct, 0 if wrong
      await pool.query(
        "INSERT INTO CardProgress (userId, cardId, timesSeen, timesCorrect, lastReviewed, nextReviewDate, easeFactor, interval) VALUES ($1, $2, 1, $3, $4, $5, $6, $7)",
        [
          userId,
          cardId,
          isCorrect ? 1 : 0,
          now,
          isCorrect ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : now,
          easeFactor,
          interval,
        ]
      );
    } else {
      // Update existing progress
      const current = progress.rows[0];
      easeFactor = Math.max(
        1.3,
        current.easefactor + (isCorrect ? 0.1 : -0.15)
      );
      interval = isCorrect ? Math.round(current.interval * easeFactor) : 0;

      nextReviewDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

      await pool.query(
        "UPDATE CardProgress SET timesSeen = $1, timesCorrect = $2, lastReviewed = $3, nextReviewDate = $4, easeFactor = $5, interval = $6 WHERE progressId = $7",
        [
          current.timesseen + 1,
          current.timescorrect + (isCorrect ? 1 : 0),
          now,
          nextReviewDate,
          easeFactor,
          interval,
          current.progressid,
        ]
      );
    }

    // Update streak
    await updateStreak(userId);

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Complete quiz session
router.post("/quiz/complete", authMiddleware, async (req, res) => {
  try {
    const { sessionId, score, totalQuestions } = req.body;

    const updatedSession = await pool.query(
      "UPDATE QuizSessions SET score = $1, totalQuestions = $2 WHERE sessionId = $3 RETURNING *",
      [score, totalQuestions, sessionId]
    );

    res.json(updatedSession.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get quiz history for a set
router.get("/history/:setId", authMiddleware, async (req, res) => {
  try {
    const { setId } = req.params;
    const userId = req.user.userId;

    const history = await pool.query(
      "SELECT * FROM QuizSessions WHERE userId = $1 AND setId = $2 ORDER BY completedAt DESC",
      [userId, setId]
    );

    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
