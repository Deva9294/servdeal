import mongoose from 'mongoose';

const jobAlertSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    distanceKm: { type: Number, required: true },
    matchScore: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
    expiresAt: { type: Date, required: true },
    respondedAt: Date,
  },
  { timestamps: true }
);

jobAlertSchema.index({ worker: 1, status: 1 });
jobAlertSchema.index({ expiresAt: 1 });
jobAlertSchema.index({ booking: 1 });

export default mongoose.model('JobAlert', jobAlertSchema);
