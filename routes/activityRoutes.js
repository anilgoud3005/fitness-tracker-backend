const express = require('express');
const router = express.Router();
const {
  logActivity,
  getUserActivities,
  deleteActivity,
  getTodaySteps
} = require('../controllers/activityController');
const db = require('../config/db');

router.post('/log', logActivity);
router.get('/user/:userId', getUserActivities);
router.delete('/:id', deleteActivity);
router.get('/steps/:userId', getTodaySteps);

router.get('/summary/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await db.query(
      `
      SELECT 
        SUM(duration_minutes) AS totalMinutes,
        SUM(CASE WHEN activity_type = 'Walking' THEN duration_minutes ELSE 0 END) AS walkingMinutes
      FROM user_activities
      WHERE user_id = :userId AND DATE(created_at) = CURDATE()
      `,
      {
        replacements: { userId },
        type: db.QueryTypes.SELECT
      }
    );

    const summary = results[0] || {};
    const totalMinutes = summary.totalMinutes || 0;
    const walkingMinutes = summary.walkingMinutes || 0;
    const calories = totalMinutes * 6; // Example: 6 kcal/min
    const steps = Math.round(walkingMinutes * 100); // Example: 100 steps/min

    res.json({ totalMinutes, walkingMinutes, steps, calories });
  } catch (err) {
    console.error('Activity summary error:', err);
    res.status(500).json({ message: 'Failed to fetch activity summary' });
  }
});


module.exports = router;

