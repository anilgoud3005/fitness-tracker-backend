const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BMICategory = sequelize.define('BMICategory', {
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  bmi_min: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  bmi_max: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'bmi_category', // <-- map to actual table
  timestamps: false
});

module.exports = BMICategory;
