const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const BMICategory = require('./BMICategory');
const MealType = require('./MealType');

const DietPlan = sequelize.define('DietPlan', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructions: {
    type: DataTypes.TEXT
  },
  calories: {
    type: DataTypes.INTEGER
  },
  protein_grams: {
    type: DataTypes.FLOAT
  },
  fat_grams: {
    type: DataTypes.FLOAT
  },
  carb_grams: {
    type: DataTypes.FLOAT
  }
}, {
  tableName: 'diet_plan',
  timestamps: false
});

// Define associations
DietPlan.belongsTo(BMICategory, { foreignKey: 'bmi_category_id', as: 'BMICategory' });
DietPlan.belongsTo(MealType, { foreignKey: 'meal_type_id', as: 'MealType' });

module.exports = DietPlan;
