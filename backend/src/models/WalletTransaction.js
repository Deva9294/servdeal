import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    payuTxnId: { type: String, index: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', index: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['credit', 'debit', 'refund', 'payout', 'withdrawal', 'commission'], required: true },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    description: { type: String, default: '' },
    metadata: mongoose.Schema.Types.Mixed,
    processedAt: { type: Date },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ createdAt: -1 });
walletTransactionSchema.index({ user: 1, createdAt: -1 });
walletTransactionSchema.index({ status: 1, type: 1 });

export default mongoose.model('WalletTransaction', walletTransactionSchema);
