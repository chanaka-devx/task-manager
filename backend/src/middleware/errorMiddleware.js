// Simple async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Not Found
const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
};

// Error Handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Server Error' });
};

module.exports = { asyncHandler, notFound, errorHandler };
