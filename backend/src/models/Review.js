import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    photos: [String],
    videos: [String],
    isVerifiedBooking: { type: Boolean, default: false },
    isModerated: { type: Boolean, default: false },
    moderationResult: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      reason: String,
      aiConfidence: Number,
    },
    isVisible: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0 },
    reportedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
