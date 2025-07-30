const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/:userId', goalController.getGoalsByUser);      // Fetch all goals
router.post('/', goalController.createGoal);                // Create new goal
router.put('/:id', goalController.updateGoal);              // Update goal
router.delete('/:id', goalController.deleteGoal);           // Delete goal
router.put('/complete/:id', goalController.completeGoal);
router.patch('/increment/:id', goalController.incrementAchievedCount);
router.get('/progress/:userId', goalController.getWeeklyProgress);

module.exports = router;
