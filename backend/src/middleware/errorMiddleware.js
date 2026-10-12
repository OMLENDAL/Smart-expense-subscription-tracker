// This middleware converts thrown errors into clean JSON responses.
// It helps the frontend show friendly messages instead of raw server errors.
function errorMiddleware(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorMiddleware;
