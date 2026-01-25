const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./errorMiddleware');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key-12345');
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      const err = new Error('Not authorized, token failed');
      err.statusCode = 401;
      throw err;
    }
  }

  if (!token) {
    const err = new Error('Not authorized, no token');
    err.statusCode = 401;
    throw err;
  }
});

module.exports = { protect };
