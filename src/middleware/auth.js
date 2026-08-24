const { verifyAccessToken } = require("../utils/jwt");
const { fail } = require("../utils/response");

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return fail(
      res,
      "Missing or invalid Authorization header. Use: Bearer <accessToken>",
      401
    );
  }

  const token = header.slice(7);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    return fail(res, "Invalid or expired access token", 401);
  }
}

module.exports = { requireAuth };
