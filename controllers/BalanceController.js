// controllers/BalanceController.js
const Balance = require('../models/Balance');

exports.getAllBalances = async (req, res) => {
  try {
    const balances = await Balance.find();
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBalance = async (req, res) => {
  try {
    const newBalance = new Balance(req.body);
    const savedBalance = await newBalance.save();
    res.status(201).json(savedBalance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBalance = async (req, res) => {
  try {
    const balance = await Balance.findOneAndUpdate(
      { balance_id: req.params.id },
      req.body,
      { new: true }
    );
    if (!balance) return res.status(404).json({ error: 'Balance not found' });
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBalance = async (req, res) => {
  try {
    const balance = await Balance.findOneAndDelete({ balance_id: req.params.id });
    if (!balance) return res.status(404).json({ error: 'Balance not found' });
    res.json({ message: 'Balance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the last balance for a specific user
exports.getLastBalanceByUserId = async (req, res) => {
  try {
    const lastBalance = await Balance.findOne({ user_id: req.params.userId }).sort({ balance_date: -1 });
    res.json(lastBalance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate the next balance ID
exports.generateNextBalanceId = async (req, res) => {
  try {
    const lastBalance = await Balance.findOne().sort({ balance_id: -1 });
    if (!lastBalance || !lastBalance.balance_id) {
      return res.json({ nextId: 'BLA_0001' });
    }
    const match = lastBalance.balance_id.match(/BLA_(\d+)/);
    if (!match) {
      console.error('Unexpected balance_id format:', lastBalance.balance_id);
      return res.json({ nextId: 'BLA_0001' });
    }
    const lastId = parseInt(match[1], 10);
    const nextId = `BLA_${(lastId + 1).toString().padStart(4, '0')}`;
    res.json({ nextId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};