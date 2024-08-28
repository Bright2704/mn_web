import mongoose, { Schema, model, Document } from 'mongoose';

const mongoURI = 'mongodb://127.0.0.1:27017/MN_TEST';
mongoose.connect(mongoURI);

interface DepositDocument extends Document {
  deposit_id: string;
  date_deposit: string;
  date_success: string;
  user_id: string;
  amount: mongoose.Schema.Types.Mixed;
  bank: string;
  status: string;
  slip: string;
}

const depositSchema = new Schema<DepositDocument>({
  deposit_id: { type: String, required: true },
  date_deposit: { type: String, required: true },
  date_success: { type: String, default: '' },
  user_id: { type: String, required: true },
  amount: { type: Schema.Types.Mixed, required: true },
  bank: { type: String, required: true },
  status: { type: String, required: true },
  slip: { type: String, required: true },
});

const Deposit = model<DepositDocument>('deposit_new', depositSchema);
