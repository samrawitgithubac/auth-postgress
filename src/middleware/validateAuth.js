const { fail } = require("../utils/response");

function validateRegister(req, res, next) {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("name is required");
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    errors.push("valid email is required");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  if (errors.length) return fail(res, "Validation failed", 400, errors);
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== "string") errors.push("email is required");
  if (!password || typeof password !== "string") errors.push("password is required");

  if (errors.length) return fail(res, "Validation failed", 400, errors);
  next();
}

function validateRefreshToken(req, res, next) {
  const { refreshToken } = req.body;
  if (!refreshToken || typeof refreshToken !== "string") {
    return fail(res, "refreshToken is required", 400);
  }
  next();
}

module.exports = { validateRegister, validateLogin, validateRefreshToken };
