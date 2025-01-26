const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { default: mongoose } = require("mongoose");

const getBalance = async (req, res) => {
  const { _id: userId } = req.user;
  const objectId = new mongoose.Types.ObjectId(userId);

  // Fetch wallet by user
  const wallet = await Wallet.findOne({ user: objectId });
  console.log(wallet);

  res.json({ balance: wallet.balance });
};

const addFunds = async (req, res) => {
  const { _id: userId } = req.user;
  const { amount } = req.body;

  const wallet = await Wallet.findOne({ user: userId });
  wallet.balance += amount;

  const transaction = new Transaction({
    wallet: wallet._id,
    amount,
    type: "credit",
  });
  await transaction.save();

  await wallet.save();
  res.json({ message: "Funds added successfully" });
};

const withdrawFunds = async (req, res) => {
  const { _id: userId } = req.user;
  const { amount } = req.body;

  const wallet = await Wallet.findOne({ user: userId });
  if (wallet.balance < amount)
    return res.status(400).json({ error: "Insufficient balance" });

  wallet.balance -= amount;

  const transaction = new Transaction({
    wallet: wallet._id,
    amount,
    type: "debit",
  });
  await transaction.save();

  await wallet.save();
  res.json({ message: "Funds withdrawn successfully" });
};

const getTransactions = async (req, res) => {
  const { _id: userId } = req.user;
  const wallet = await Wallet.findOne({ user: userId });
  const transactions = await Transaction.find({ wallet: wallet._id }).sort({
    createdAt: -1,
  });

  res.json(transactions);
};

const getUserDetails = async (req, res) => {
  const { _id: userId } = req.user;
  const objectId = new mongoose.Types.ObjectId(userId);

  // Fetch wallet by user
  const user = await User.findOne({ _id: objectId });

  res.json({ user });
};
const getUserMail = async (req, res) => {
  const { userId } = req.body;
  const objectId = new mongoose.Types.ObjectId(userId);

  // Fetch wallet by user
  const user = await User.findOne({ _id: objectId });
  const mail = user.email;
  res.json({ mail });
};

const transferFunds = async (req, res) => {
  const { _id: senderId } = req.user;
  const { recipientEmail, amount } = req.body;

  try {
    // Validate sender ID
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: "Invalid sender ID" });
    }

    // Validate recipient
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const recipientId = recipient._id;

    // Validate funds
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    const objectId = new mongoose.Types.ObjectId(senderId);
    const senderWallet = await Wallet.findOne({ user: objectId });
    const recipientWallet = await Wallet.findOne({ user: recipientId });

    if (!senderWallet || !recipientWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Perform the transfer
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    // Save wallets
    await senderWallet.save();
    await recipientWallet.save();

    const senderTransaction = new Transaction({
      amount,
      type: "debit",
      wallet: senderWallet._id,
      sender: senderId,
      receiver: recipientId,
    });
    await senderTransaction.save();

    const recipientTransaction = new Transaction({
      amount,
      type: "credit",
      wallet: recipientWallet._id,
      sender: senderId,
      receiver: recipientId,
    });
    await recipientTransaction.save();

    res.json({ message: "Transfer successful" });
  } catch (error) {
    console.error("Error transferring funds:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSpendingInsights = async (req, res) => {
  const { _id: userId } = req.user;
  const objectId = new mongoose.Types.ObjectId(userId);
  try {
    // Find the user's wallet
    const wallet = await Wallet.findOne({ user: objectId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Query transactions where the user is the sender (debits)
    const transactions = await Transaction.find({ wallet: wallet._id });
    console.log(transactions);

    if (!transactions || transactions.length === 0) {
      return res.json({ totalSpent: 0, monthlySpent: 0 });
    }

    // Calculate total spent
    const totalSpent = transactions
      .filter((t) => t.type === "debit")
      .reduce((acc, t) => acc + t.amount, 0);

    // Calculate spending for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlySpent = transactions
      .filter((t) => {
        const transactionDate = new Date(t.createdAt);
        return (
          t.type === "debit" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, t) => acc + t.amount, 0);

    res.json({ totalSpent, monthlySpent });
  } catch (error) {
    console.error("Error fetching spending insights:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getBalance,
  addFunds,
  withdrawFunds,
  getTransactions,
  getUserDetails,
  transferFunds,
  getUserMail,
  getSpendingInsights,
};
