const express = require('express');
const router = express.Router();
const { getDietPlanByBMI } = require('../controllers/dietController');

// MUST exist:
router.get('/bmi/:bmi', getDietPlanByBMI);

module.exports = router;
