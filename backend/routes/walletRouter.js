// routes/index.js
const express = require("express");
const { signup, login } = require("../controllers/authController");
const {
  getBalance,
  addFunds,
  withdrawFunds,
  getTransactions,
  getUserDetails,
  transferFunds,
  getUserMail,
  getSpendingInsights,
} = require("../controllers/walletController");

const router = express.Router();

router.get("/balance", getBalance);
router.post("/add", addFunds);
router.post("/withdraw", withdrawFunds);
router.get("/transactions", getTransactions);
router.post("/transfer", transferFunds);
router.get("/user", getUserDetails);
router.post("/userMail", getUserMail);
router.get("/insights", getSpendingInsights);
module.exports = router;
