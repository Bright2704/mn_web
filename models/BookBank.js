// models/BookBank.js
const mongoose = require('mongoose');

const BookBankSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  bank: { type: String, required: true },
  account_name: { type: String, required: true },
  account_number: { type: String, required: true },
  branch: { type: String },
});

module.exports = mongoose.model('BookBank', BookBankSchema, 'book_bank');
