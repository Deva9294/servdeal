import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: { type: String, enum: ['customer', 'provider', 'worker'], default: 'customer' },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', walletSchema);
