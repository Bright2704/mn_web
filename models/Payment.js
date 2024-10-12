// models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    tracking: [
    {
        trackingID: String,
        lotNumber: String,
        // create_date: { type: Date, required: true },
        create_date: Date,
        price: Number,
    },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentNumber: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    export_date: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        default: 'รอการอนุมัติ',
    },
    address: {
        province: String,
        district: String,
        subdistrict: String,
        postalCode: String,
        transport: String,
    },
    transport :{
        type: String,
        required: true,
    },
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

export default Payment;