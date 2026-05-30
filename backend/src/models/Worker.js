import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    experienceYears: { type: Number, default: 0, min: 0 },
    expectedDailyWage: { type: Number, default: 0, min: 0 },
    expectedMonthlySalary: { type: Number, default: 0, min: 0 },
    availabilityType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'part-time', 'full-time'],
      default: 'daily',
    },
    availableForWork: { type: Boolean, default: true },
    workingRadiusKm: { type: Number, default: 10, min: 1, max: 100 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [85.1376, 25.5941] }, // [lng, lat]
    },
    documents: {
      aadhaarNumber: String,
      panNumber: String,
      aadhaarUrl: String,
      panUrl: String,
    },
    portfolioUrls: [String],
    certificates: [String],
    badges: [
      {
        badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
        awardedAt: { type: Date, default: Date.now },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

workerSchema.index({ location: '2dsphere' });
workerSchema.index({ skills: 1, availableForWork: 1 });

export default mongoose.model('Worker', workerSchema);


