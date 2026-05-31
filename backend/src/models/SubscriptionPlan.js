import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    targetRole: {
      type: String,
      enum: ['customer', 'provider', 'worker'],
      required: true,
    },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    features: [String],
    benefits: {
      priorityVisibility: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      zeroCommission: { type: Boolean, default: false },
      commissionDiscountPercent: { type: Number, default: 0 },
      freeJobPosts: { type: Number, default: 0 },
      featuredProfile: { type: Boolean, default: false },
      analyticsAccess: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('SubscriptionPlan', planSchema);
