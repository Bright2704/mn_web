// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user_id: String,
  order_id: String,
  product: String,
  note: String,
  trans_type: String,
  status: String
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
