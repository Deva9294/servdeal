import mongoose from 'mongoose';

const workHistorySchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    serviceName: { type: String, trim: true },
    images: [String],
    videos: [String],
    clientName: String,
    clientRating: { type: Number, min: 0, max: 5 },
    clientReview: String,
    location: {
      city: String,
      state: String,
    },
    amount: { type: Number, default: 0 },
    workedAt: Date,
    durationHours: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

workHistorySchema.index({ worker: 1, createdAt: -1 });
workHistorySchema.index({ provider: 1 });
workHistorySchema.index({ isPublic: 1, isFeatured: 1 });

export default mongoose.model('WorkHistory', workHistorySchema);
