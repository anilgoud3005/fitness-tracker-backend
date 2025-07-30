const { Op } = require('sequelize');
const UserActivity = require('../models/UserActivity');

exports.logActivity = async (req, res) => {
  const { user_id, activity_type, duration_minutes, notes } = req.body;

  if (!user_id || !activity_type || !duration_minutes) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newActivity = await UserActivity.create({
      user_id,
      activity_type,
      duration_minutes,
      notes
    });

    return res.status(201).json({ message: 'Activity logged', activity: newActivity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserActivities = async (req, res) => {
  const { userId } = req.params;

  try {
    const activities = await UserActivity.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await UserActivity.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Activity not found' });

    return res.status(200).json({ message: 'Activity deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getTodaySteps = async (req, res) => {
  const { userId } = req.params;
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

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

    // Assume 100 steps per minute of walking (adjust based on research)
    const totalMinutes = activities.reduce((sum, a) => sum + a.duration_minutes, 0);
    const steps = totalMinutes * 100;

    res.status(200).json({ steps, totalMinutes });
  } catch (err) {
    console.error('Error fetching steps:', err);
    res.status(500).json({ message: 'Failed to fetch steps' });
  }
};
