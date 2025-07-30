const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FitnessGoal = sequelize.define('FitnessGoal', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  goal_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  achieved_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  start_date: {
    type: DataTypes.DATEONLY,
  },
  end_date: {
    type: DataTypes.DATEONLY,
  },
  reminder_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fitness_goals',
  timestamps: false
});

module.exports = FitnessGoal;
