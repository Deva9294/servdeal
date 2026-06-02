import mongoose from 'mongoose';

const cashbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    walletTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'WalletTransaction', index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', index: true },
    amount: { type: Number, required: true, min: 0 },
    percentage: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ['booking', 'promotional', 'referral', 'membership', 'loyalty'],
      default: 'booking',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'credited', 'expired', 'reversed'],
      default: 'pending',
      index: true,
    },
    description: { type: String, default: '' },
    expiresAt: { type: Date },
    creditedAt: { type: Date },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

cashbackSchema.index({ user: 1, status: 1 });
cashbackSchema.index({ createdAt: -1 });
cashbackSchema.index({ expiresAt: 1 });

export default mongoose.model('Cashback', cashbackSchema);
