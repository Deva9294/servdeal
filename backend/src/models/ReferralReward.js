import mongoose from 'mongoose';

const referralRewardSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referrerCode: { type: String, required: true },
    amount: { type: Number, default: 100 },
    status: {
      type: String,
      enum: ['pending', 'credited', 'rejected'],
      default: 'pending',
    },
    trigger: {
      type: String,
      enum: ['signup', 'first_booking', 'first_payment'],
      default: 'signup',
    },
    creditedAt: Date,
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
);

referralRewardSchema.index({ referrer: 1, status: 1 });
referralRewardSchema.index({ referee: 1 });
referralRewardSchema.index({ referrerCode: 1 });

export default mongoose.model('ReferralReward', referralRewardSchema);
