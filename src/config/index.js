require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4001,
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET || "teaching-access-secret-change-me",
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  refreshTokenExpiresDays: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,
  bcryptRounds: 10,
};
