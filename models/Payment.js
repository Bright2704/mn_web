// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  order_id: { type: String, required: true },
  cus_id: { type: String, required: true },
  product: { type: String, required: true },
  note: { type: String, required: false },
  trans_type: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: String, required: true },
  // Add other fields as needed
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;