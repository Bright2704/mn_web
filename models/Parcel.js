// models/Parcel.js
import mongoose from 'mongoose';

const ParcelSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    code: { type: String, required: true },
    lot: { type: String, required: true },
    note: { type: String, required: true },
    number: { type: String, required: false },
    vehicle: { type: String, required: true },
    length: { type: String, required: true },
    mnemonic_phrases: { type: String, required: true },
    price: { type: String, required: true },
    width: { type: String, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    amount: { type: String, required: true },
    pay: { type: String, required: true },
    customer: { type: String, required: true },
    create_date: { type: Date, required: true },
    in_cn: { type: Date, required: true },
    out_cn: { type: Date, required: true },
    in_th: { type: Date, required: true },
    pay_date: { type: Date, required: true },
    // Add other fields as needed
});

const Parcel = mongoose.models.Parcel || mongoose.model('Parcel', ParcelSchema);

export default Parcel;