// models/withdrawModel.js
const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  withdraw_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true
  },
  date_withdraw: {
    type: String,
    required: true
  },
  date_success: {
    type: String,
    default: ''
  },
  bank: {
    type: String,
    required: true
  },
  account_name: {
    type: String,
    required: true
  },
  account_number: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  withdraw_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'wait'
  },
  slip: {
    type: String,
    default: ''
  },
  note: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Withdraw', withdrawSchema);