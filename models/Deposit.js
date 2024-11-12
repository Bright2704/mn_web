// models/Deposit.js
const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
  user_id: String,
  deposit_id: String,
  date_deposit: String,
  date_success: String,
  amount: mongoose.Schema.Types.Mixed,
  bank: String,
  status: String,
  slip: String,
  note: String,
  six_digits:String
});

module.exports = mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema);
