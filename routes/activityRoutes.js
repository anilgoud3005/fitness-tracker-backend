const express = require('express');
const router = express.Router();
const {
  logActivity,
  getUserActivities,
  deleteActivity,
  getTodaySteps
} = require('../controllers/activityController');

router.post('/log', logActivity);
router.get('/user/:userId', getUserActivities);
router.delete('/:id', deleteActivity);
router.get('/steps/:userId', getTodaySteps);

module.exports = router;
