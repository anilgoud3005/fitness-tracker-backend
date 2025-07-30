const express = require('express');
const router = express.Router();
const stepsController = require('../controllers/stepsController');

router.get('/steps/:userId', stepsController.getTodaySteps);

module.exports = router;