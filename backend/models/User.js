// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
});

module.exports = mongoose.model("User", userSchema);
