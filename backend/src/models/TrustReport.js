import mongoose from 'mongoose';

const trustReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['fake_review', 'fake_booking', 'duplicate_account', 'suspicious_activity'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    targetBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    targetReview: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    reason: String,
    aiConfidence: { type: Number, min: 0, max: 1 },
    metadata: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['open', 'reviewed', 'resolved', 'false_positive'],
      default: 'open',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    actionTaken: String,
  },
  { timestamps: true }
);

export default mongoose.model('TrustReport', trustReportSchema);
