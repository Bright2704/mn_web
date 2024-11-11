// models/Lot.js
const mongoose = require('mongoose');

const LotSchema = new mongoose.Schema({
  lot_id: String,
  lot_type: String,
  in_cn: String,
  out_cn: String,
  in_th: String,
  num_item: String,
  note: String,
  file_path: String,
  image_path: String
});

module.exports = mongoose.models.Lot || mongoose.model('Lot', LotSchema);
