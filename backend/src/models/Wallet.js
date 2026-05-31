import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credit', 'debit', 'refund', 'payout', 'withdrawal', 'commission'] },
  amount: Number,
  description: String,
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  withdrawal: { type: mongoose.Schema.Types.ObjectId, ref: 'Withdrawal' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: { type: String, enum: ['customer', 'provider', 'worker'], default: 'customer' },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', walletSchema);
