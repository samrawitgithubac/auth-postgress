const jwt = require("jsonwebtoken");
const config = require("../config");

function signAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtAccessSecret,
    { expiresIn: config.accessTokenExpiresIn }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtAccessSecret);
}

module.exports = { signAccessToken, verifyAccessToken };
