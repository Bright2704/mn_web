const mongoose = require('mongoose');

const LotSchema = new mongoose.Schema({
  lot_id: {
    type: String,
    required: true,
    unique: true
  },
  lot_type: {
    type: String,
    required: true
  },
  in_cn: {
    type: String,
    default: ''
  },
  out_cn: {
    type: String,
    default: ''
  },
  in_th: {
    type: String,
    default: ''
  },
  num_item: {
    type: String,
    default: '0'
  },
  note: {
    type: String,
    default: ''
  },
  file_path: {
    type: String,
    default: null
  },
  image_path: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.models.Lot || mongoose.model('Lot', LotSchema, 'lot');