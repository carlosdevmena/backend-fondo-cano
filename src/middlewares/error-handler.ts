function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  const details = err.details || undefined;

  if (status >= 500) {
    req.log?.error({ err }, "Unhandled server error");
  }

  return res.status(status).json({
    error: message,
    details,
  });
}

module.exports = { errorHandler };
