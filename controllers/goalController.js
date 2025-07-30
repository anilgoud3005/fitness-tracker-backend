const FitnessGoal = require('../models/FitnessGoal');
const db = require('../config/db');
const sequelize = require("../config/db");


// Get all goals for a specific user
exports.getGoalsByUser = async (req, res) => {
  try {
    const goals = await FitnessGoal.findAll({
      where: { user_id: req.params.userId },
      order: [['start_date', 'DESC']]
    });

    if (!goals.length) {
      return res.status(404).json({ message: 'No goals found for user' });
    }

    res.status(200).json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ message: 'Error fetching goals' });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const newGoal = await FitnessGoal.create(req.body);
    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(400).json({ message: 'Error creating goal' });
  }
};

// Update an existing goal
exports.updateGoal = async (req, res) => {
  try {
    const [updated] = await FitnessGoal.update(req.body, {
      where: { id: req.params.id }
    });

    updated
      ? res.json({ message: 'Goal updated successfully' })
      : res.status(404).json({ message: 'Goal not found' });
  } catch (err) {
    console.error('Error updating goal:', err);
    res.status(500).json({ message: 'Error updating goal' });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const deleted = await FitnessGoal.destroy({
      where: { id: req.params.id }
    });

    deleted
      ? res.json({ message: 'Goal deleted successfully' })
      : res.status(404).json({ message: 'Goal not found' });
  } catch (err) {
    console.error('Error deleting goal:', err);
    res.status(500).json({ message: 'Error deleting goal' });
  }
};

exports.completeGoal = async (req, res) => {
  const goalId = req.params.id;

  try {
    const goal = await FitnessGoal.findByPk(goalId);

    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.achieved_count = goal.target_count;
    await goal.save();

    return res.status(200).json({ message: 'Goal marked as complete', goal });
  } catch (err) {
    console.error('Error completing goal:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.incrementAchievedCount = async (req, res) => {
  const { id } = req.params;
  try {
    const goal = await FitnessGoal.findByPk(id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.achieved_count = Math.min(goal.target_count, goal.achieved_count + 1);
    await goal.save();

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating progress' });
  }
};

exports.getWeeklyProgress = async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    // 👇 Ensure userId is passed as an array for proper binding
    const [goals] = await db.query(
      `
  SELECT target_count, achieved_count, 
         DATEDIFF(end_date, start_date) AS duration_days,
         start_date, end_date
  FROM fitness_goals 
  WHERE user_id = :userId 
  ORDER BY start_date DESC 
  LIMIT 1
  `,
      {
        replacements: { userId },
        type: db.QueryTypes.SELECT
      }
    );

    if (!goals.length) {
      return res.json({ progress: 0, streak: 0 });
    }

    const goal = goals[0];
    const progress = Math.min((goal.achieved_count / goal.target_count) * 100, 100);

    // Fetch completed goals for streak
    const [streaks] = await db.query(
      `SELECT COUNT(*) AS streak FROM fitness_goals 
       WHERE user_id = ? AND achieved_count >= target_count`,
      [userId]
    );

    return res.json({
      progress,
      streak: streaks[0].streak
    });
  } catch (err) {
    console.error('Error calculating goal progress:', err);
    res.status(500).json({ message: 'Error fetching goal progress' });
  }
};


