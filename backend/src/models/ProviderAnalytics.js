import mongoose from 'mongoose';

const providerAnalyticsSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, unique: true },
    totalJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    avgResponseTimeMinutes: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    customerSatisfactionScore: { type: Number, default: 0 },
    monthlyStats: [
      {
        month: String,
        jobs: Number,
        earnings: Number,
        rating: Number,
      },
    ],
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('ProviderAnalytics', providerAnalyticsSchema);
