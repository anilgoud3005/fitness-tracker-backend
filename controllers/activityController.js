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