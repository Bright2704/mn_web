// models/TaxInfo.js
const mongoose = require('mongoose');

const TaxInfoSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  taxId: { type: String, required: true },
  customerType: { type: String, required: true },
  document: { type: String, required: true }
});

module.exports = mongoose.model('TaxInfo', TaxInfoSchema, 'tax_info');