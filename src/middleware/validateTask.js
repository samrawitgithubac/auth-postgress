const { fail } = require("../utils/response");

function validateCreateTask(req, res, next) {
  const { title, description } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("title is required");
  }
  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }

  if (errors.length) return fail(res, "Validation failed", 400, errors);
  next();
}

function validateUpdateTask(req, res, next) {
  const { title, description, completed } = req.body;
  const errors = [];

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    errors.push("title must be a non-empty string");
  }
  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("completed must be true or false");
  }

  if (title === undefined && description === undefined && completed === undefined) {
    errors.push("provide at least one field: title, description, or completed");
  }

  if (errors.length) return fail(res, "Validation failed", 400, errors);
  next();
}

module.exports = { validateCreateTask, validateUpdateTask };
