import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    isModerated: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
