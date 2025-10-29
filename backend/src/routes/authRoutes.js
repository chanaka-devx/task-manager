const express = require('express');
const { signupValidation, loginValidation } = require('../validators/authValidators');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// Admin routes
router.post('/signup', signupValidation, signup('admin'));
router.post('/login', loginValidation, login('admin'));

// Customer routes
router.post('/signup', signupValidation, signup('customer'));
router.post('/login', loginValidation, login('customer'));

module.exports = router;
