const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');

const handleValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array().map((e) => e.msg).join(', '));
    err.statusCode = 400;
    throw err;
  }
};

const signup = (role) => asyncHandler(async (req, res) => {
  handleValidation(req);
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('User already exists');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken({ id: user._id, role: user.role });
  res.status(201).json({
    token,
    role: user.role,
    user_id: user._id,
    email: user.email,
  });
});

const login = (role) => asyncHandler(async (req, res) => {
  handleValidation(req);
  const { email, password } = req.body;
  const user = await User.findOne({ email, role });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }
  const match = await user.matchPassword(password);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }
  const token = generateToken({ id: user._id, role: user.role });
  res.json({ token, role: user.role, user_id: user._id, email: user.email });
});

module.exports = { signup, login };
