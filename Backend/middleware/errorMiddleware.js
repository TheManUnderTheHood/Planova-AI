const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const statusCode = error.statusCode || error.status || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error('Unhandled request error:', error);
  }

  res.status(statusCode).json({
    success: false,
    error: isServerError ? 'Internal server error.' : error.message,
  });
};

module.exports = { notFound, errorHandler };