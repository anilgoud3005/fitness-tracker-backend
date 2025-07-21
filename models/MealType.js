const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MealType = sequelize.define('MealType', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'meal_type',
  timestamps: false
});

module.exports = MealType;
