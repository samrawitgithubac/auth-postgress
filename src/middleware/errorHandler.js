const { fail } = require("../utils/response");

function notFound(req, res) {
  return fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

function errorHandler(err, req, res, next) {
  if (err.code === "P2002") {
    return fail(res, "Email already registered", 409);
  }

  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  if (status >= 500) console.error(err);
  return fail(res, message, status);
}

module.exports = { notFound, errorHandler };
