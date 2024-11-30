// models/CreatePayment.js
const mongoose = require('mongoose');

const CreatePaymentSchema = new mongoose.Schema({
  pay_id: String,
  user_id: String, // Add user_id field
  status: {
    type: String,
    default: 'wait',
    enum: ['wait', 'del_thai', 'del_mn', 'success','failed']
  },
  recipientName: String,
  address: String,
  province: String,
  district: String,
  subdistrict: String,
  postalCode: String,
  phone: String,
  transportType: String,
  shippingPayment: String,
  selectedCarrier: String,
  senderOption: String,
  senderDetails: {
    name: String,
    address: String,
    phone: String
  },
  receiptRequired: Boolean,
  taxInfo: {
    type: {
      name: String,
      address: String,
      phone: String,
      taxId: String,
      customerType: String,
      document: String
    },
    default: null
  },
  agreementAccepted: Boolean,
  balance: Number,
  importFee: Number,
  serviceFee: Number,
  transportFee: Number,
  paymentType: String,
  total: Number,
  notes: String,
  trackings: [{
    tracking_id: String,
    lot_id: String,
    lot_type: String,
    lot_order: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  approveAt: {
    type: Date,
    default: null
  },
  transportFee_th: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('CreatePayment', CreatePaymentSchema, 'createpayment');