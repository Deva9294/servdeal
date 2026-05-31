import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    city: String,
    dayOfWeek: { type: Number, min: 0, max: 6 },
    startHour: { type: Number, min: 0, max: 23 },
    endHour: { type: Number, min: 0, max: 23 },
    demandMultiplier: { type: Number, default: 1.0 },
    supplyMultiplier: { type: Number, default: 1.0 },
    distanceMultiplier: { type: Number, default: 1.0 },
    emergencyMultiplier: { type: Number, default: 1.0 },
    maxMultiplier: { type: Number, default: 2.0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('DynamicPricing', pricingRuleSchema);
