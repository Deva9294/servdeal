import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    amount: { type: Number, required: true, min: 100 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'processed'],
      default: 'pending',
    },
    method: {
      type: String,
      enum: ['bank_transfer', 'upi'],
      default: 'bank_transfer',
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
      upiId: String,
    },
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String,
    transactionRef: String,
  },
  { timestamps: true }
);

export default mongoose.model('Withdrawal', withdrawalSchema);
