const { Op } = require('sequelize');
const DietPlan = require('../models/DietPlan');
const BMICategory = require('../models/BMICategory');
const MealType = require('../models/MealType');

exports.getDietPlanByBMI = async (req, res) => {
  const { bmi } = req.params;
  const parsedBMI = parseFloat(bmi);

  if (isNaN(parsedBMI)) {
    return res.status(400).json({ message: 'Invalid BMI value' });
  }

  try {
    const category = await BMICategory.findOne({
      where: {
        bmi_min: { [Op.lte]: parsedBMI },
        bmi_max: { [Op.gte]: parsedBMI }
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'No matching BMI category found' });
    }

    const plans = await DietPlan.findAll({
      where: { bmi_category_id: category.id },
      include: [
        {
          model: MealType,
          as: 'MealType' // <-- MUST match association name
        }
      ]
    });

    return res.status(200).json({
      bmi: parsedBMI,
      category: category.category_name,
      diet: plans
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
