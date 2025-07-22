const express = require('express');
const router = express.Router();
const {
  logActivity,
  getUserActivities,
  deleteActivity
} = require('../controllers/activityController');

router.post('/log', logActivity);
router.get('/user/:userId', getUserActivities);
router.delete('/:id', deleteActivity);

module.exports = router;
