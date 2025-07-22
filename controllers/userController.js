const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  const userId = req.params.id;
  const {
    name, email, password, gender, phone, address, weight, height, age
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.age = age || user.age;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        weight: user.weight,
        height: user.height,
        age: user.age
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
