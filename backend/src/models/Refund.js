import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', index: true },
    walletTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'WalletTransaction', index: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    refundMethod: {
      type: String,
      enum: ['wallet', 'original_payment', 'upi', 'bank'],
      default: 'wallet',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    processedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

refundSchema.index({ user: 1, status: 1 });
refundSchema.index({ createdAt: -1 });
refundSchema.index({ booking: 1 });

export default mongoose.model('Refund', refundSchema);
