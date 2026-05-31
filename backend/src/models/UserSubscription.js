import mongoose from 'mongoose';

const userSubscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    autoRenew: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('UserSubscription', userSubscriptionSchema);
