// routes/index.js
const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
  refreshAccessTokenController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/refresh", refreshAccessTokenController);
router.get("/logout", logoutController);

module.exports = router;
