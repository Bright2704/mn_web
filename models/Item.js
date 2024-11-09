// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user_id: String,
  tracking_number: String,
  lot: String,
  type_transport: String,
  follow_by: String,
  china_shipping_cost: Number,
  china_shipping_cost_baht: Number,
  packaging: String,
  check_product: String,
  warehouse_entry: String,
  departure_from_china: String,
  arrival_in_thailand: String,
  status: String
});

module.exports = mongoose.model('Item', ItemSchema, 'items');
