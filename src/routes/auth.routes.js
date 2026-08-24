const express = require("express");
const authController = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
} = require("../middleware/validateAuth");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/refresh", validateRefreshToken, authController.refresh);
router.post("/logout", validateRefreshToken, authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;
