import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  type: { type: String, enum: ['aadhaar', 'pan', 'license', 'other'] },
  url: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

const portfolioSchema = new mongoose.Schema({
  title: String,
  description: String,
  mediaUrl: String,
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  createdAt: { type: Date, default: Date.now },
});

const certificateSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  url: String,
  verified: { type: Boolean, default: false },
  verifiedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: String,
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    experienceYears: { type: Number, default: 0 },
    bio: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    documents: [documentSchema],
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isOnline: { type: Boolean, default: false },
    lastOnlineAt: Date,
    availability: {
      monday: { enabled: Boolean, slots: [String] },
      tuesday: { enabled: Boolean, slots: [String] },
      wednesday: { enabled: Boolean, slots: [String] },
      thursday: { enabled: Boolean, slots: [String] },
      friday: { enabled: Boolean, slots: [String] },
      saturday: { enabled: Boolean, slots: [String] },
      sunday: { enabled: Boolean, slots: [String] },
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
      upiId: String,
    },
    serviceRadiusKm: { type: Number, default: 10 },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [85.1376, 25.5941] },
    },
    totalEarnings: { type: Number, default: 0 },
    pendingPayout: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalJobRequests: { type: Number, default: 0 },
    acceptedJobs: { type: Number, default: 0 },
    avgResponseTimeMinutes: { type: Number, default: 0 },
    customerSatisfactionScore: { type: Number, default: 0 },
    city: String,
    portfolio: [portfolioSchema],
    certificates: [certificateSchema],
    skills: [String],
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    isFeatured: { type: Boolean, default: false },
    subscriptionStatus: {
      type: String,
      enum: ['none', 'active', 'expired'],
      default: 'none',
    },
    subscriptionExpiresAt: Date,
    enabledServices: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

providerSchema.index({ currentLocation: '2dsphere' });

export default mongoose.model('Provider', providerSchema);
