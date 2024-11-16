// models/BookAddress.js
const mongoose = require('mongoose');

const BookAddressSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  province: { type: String, required: true },
  districts: { type: String, required: true },
  subdistricts: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model('BookAddress', BookAddressSchema, 'book_address');