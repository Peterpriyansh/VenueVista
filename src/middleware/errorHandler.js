function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const statusCode =
    Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 600
      ? err.statusCode
      : 500;

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR"),
      message:
        statusCode === 500 && process.env.NODE_ENV === "production"
          ? "An unexpected error occurred."
          : err.message || "An unexpected error occurred."
    }
  });
}

module.exports = errorHandler;
