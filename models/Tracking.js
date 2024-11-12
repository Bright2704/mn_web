// models/Tracking.js
const mongoose = require('mongoose');

const TrackingSchema = new mongoose.Schema({
  user_id: String,
  lot_id: String,
  lot_order: String,
  not_owner: Boolean,
  tracking_id: String,
  buylist_id: String,
  mnemonics: String,
  lot_type: String,
  type_item: String,
  crate: String,
  check_product: String,
  weight: Number,
  wide: Number,
  high: Number,
  long: Number,
  number: Number,
  pricing: String,
  user_rate: String,
  in_cn: String,
  out_cn: String,
  in_th: String,
  check_product_price: Number,
  new_wrap: Number,
  transport: Number,
  price_crate: Number,
  other: Number,
  status: String,
  bill_id: String,
  cal_price: Number,
  transport_file_path: String,
  image_item_paths: [String] // Array to store multiple image paths
});

module.exports = mongoose.models.Tracking || mongoose.model('Tracking', TrackingSchema);
