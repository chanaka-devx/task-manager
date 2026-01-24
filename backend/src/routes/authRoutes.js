const express = require('express');
const { signupValidation, loginValidation } = require('../validators/authValidators');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

module.exports = router;
