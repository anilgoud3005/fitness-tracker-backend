const { Op } = require('sequelize');
const FitnessGoal = require('../models/FitnessGoal');
const User = require('../models/User');

exports.checkWeeklyGoalStreak = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get goals that ended in the past 7 days and are completed
    const recentGoals = await FitnessGoal.findAll({
      where: {
        user_id: userId,
        end_date: {
          [Op.between]: [
            new Date(new Date().setDate(new Date().getDate() - 7)),
            new Date()
          ]
        },
        achieved_count: { [Op.gte]: Sequelize.col('target_count') }
      }
    });

    if (recentGoals.length > 0) {
      // If at least one goal completed in the past week, increment streak
      const user = await User.findByPk(userId);
      user.current_streak = (user.current_streak || 0) + 1;
      await user.save();

      return res.json({ message: 'Streak increased!', current_streak: user.current_streak });
    } else {
      return res.json({ message: 'No weekly goal completed', current_streak: null });
    }
  } catch (err) {
    console.error('Streak check failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};