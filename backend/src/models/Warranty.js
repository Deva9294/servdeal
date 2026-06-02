import mongoose from 'mongoose';

const warrantySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    warrantyId: { type: String, unique: true },
    durationDays: { type: Number, required: true, default: 30 },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'expired', 'claimed', 'resolved'],
      default: 'active',
      index: true,
    },
    description: { type: String, default: '' },
    terms: { type: String, default: '' },
    claim: {
      reason: { type: String },
      description: { type: String },
      images: [String],
      status: {
        type: String,
        enum: ['none', 'submitted', 'under_review', 'approved', 'rejected', 'resolved'],
        default: 'none',
      },
      submittedAt: { type: Date },
      resolvedAt: { type: Date },
      resolution: { type: String },
      refundAmount: { type: Number, default: 0 },
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

warrantySchema.pre('save', function generateWarrantyId(next) {
  if (!this.warrantyId) {
    this.warrantyId = `WAR-${Date.now().toString().slice(-8)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }
  next();
});

warrantySchema.index({ user: 1, status: 1 });
warrantySchema.index({ expiresAt: 1 });
warrantySchema.index({ provider: 1, status: 1 });

export default mongoose.model('Warranty', warrantySchema);
