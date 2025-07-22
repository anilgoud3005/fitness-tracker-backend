const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserActivity = sequelize.define('UserActivity', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  activity_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'user_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = UserActivity;
