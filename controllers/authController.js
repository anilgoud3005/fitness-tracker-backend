const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const tokenGenerator = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    weight,
    height,
    gender,
    phone,
    address,
    age
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      weight,
      height,
      gender,
      phone,
      address,
      age,
    });

    const token = tokenGenerator(newUser.id);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        weight: newUser.weight,
        height: newUser.height,
        gender: newUser.gender,
        phone: newUser.phone,
        address: newUser.address,
        age: newUser.age,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = tokenGenerator(user.id);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        age: user.age,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBMI = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user || !user.height || !user.weight) {
      return res.status(404).json({ message: "Height or weight not available" });
    }

    const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    return res.status(200).json({
      bmi,
      category,
      weight: user.weight,
      height: user.height,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateHeightWeight = async (req, res) => {
  const { id } = req.params;
  const { height, weight } = req.body;

  if (!height || !weight) {
    return res.status(400).json({ message: 'Height and weight are required' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.height = height;
    user.weight = weight;
    await user.save();

    return res.status(200).json({
      message: 'Height and weight updated successfully',
      user: {
        id: user.id,
        height: user.height,
        weight: user.weight,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error' });
  }
};
