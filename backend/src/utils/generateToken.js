const jwt = require('jsonwebtoken');

function generateToken(payload, expiresIn = '7d') {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;
