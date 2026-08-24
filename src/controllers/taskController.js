const taskService = require("../services/taskService");
const { success } = require("../utils/response");

async function list(req, res, next) {
  try {
    const tasks = await taskService.listMine(req.user.userId);
    return success(res, tasks);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const task = await taskService.getMine(req.user.userId, Number(req.params.id));
    return success(res, task);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const task = await taskService.create(req.user.userId, req.body);
    return success(res, task, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await taskService.update(
      req.user.userId,
      Number(req.params.id),
      req.body
    );
    return success(res, task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await taskService.remove(req.user.userId, Number(req.params.id));
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
