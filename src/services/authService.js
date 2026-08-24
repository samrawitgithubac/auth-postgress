/**
 * AUTH SERVICE — uses Prisma instead of in-memory arrays
 */

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const config = require("../config");
const { signAccessToken } = require("../utils/jwt");
const { publicUser } = require("../utils/response");

function unauthorized(message = "Invalid email or password") {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

function refreshExpiresAt() {
  const date = new Date();
  date.setDate(date.getDate() + config.refreshTokenExpiresDays);
  return date;
}

async function createRefreshToken(userId) {
  const token = crypto.randomBytes(40).toString("hex");
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: refreshExpiresAt(),
    },
  });
  return token;
}

async function issueTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);
  return { accessToken, refreshToken };
}

async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
    },
  });

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) throw unauthorized();

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw unauthorized();

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

async function refresh(refreshToken) {
  const record = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    if (record) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
    }
    throw unauthorized("Invalid or expired refresh token");
  }

  const accessToken = signAccessToken(record.user);
  return { accessToken };
}

async function logout(refreshToken) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  return { message: "Logged out successfully" };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return publicUser(user);
}

module.exports = { register, login, refresh, logout, getProfile };
