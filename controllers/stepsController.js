const { Op } = require('sequelize');
const UserActivity = require('../models/UserActivity');

exports.getTodaySteps = async (req, res) => {
  const userId = req.params.userId;
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  try {
    const activities = await UserActivity.findAll({
      where: {
        user_id: userId,
        activity_type: 'Walking',
        created_at: {
          [Op.gte]: new Date(`${today}T00:00:00`),
          [Op.lte]: new Date(`${today}T23:59:59`)
        }
      }
    });

    const totalMinutes = activities.reduce((sum, a) => sum + a.duration_minutes, 0);
    const steps = totalMinutes * 100;

    res.json({ steps, minutes: totalMinutes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to calculate steps' });
  }
};