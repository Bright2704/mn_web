// models/Balance.js
const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
  user_id: String,
  balance_id: String,
  balance_date: String,
  balance_type: String,
  balance_descri: String,
  balance_amount: Number,
  balance_total: Number
});

module.exports = mongoose.model('Balance', BalanceSchema, 'balance');
