const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');

router.post('/check-weekly-streak/:userId', streakController.checkWeeklyGoalStreak);

module.exports = router;
