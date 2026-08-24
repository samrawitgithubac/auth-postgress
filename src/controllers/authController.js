const authService = require("../services/authService");
const { success } = require("../utils/response");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const result = await authService.logout(req.body.refreshToken);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const profile = await authService.getProfile(req.user.userId);
    return success(res, profile);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout, me };
