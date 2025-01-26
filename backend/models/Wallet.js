// models/Wallet.js
const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  balance: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Wallet", walletSchema);
