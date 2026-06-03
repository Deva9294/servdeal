import mongoose from 'mongoose';

const kycDocSchema = new mongoose.Schema({
  type: { type: String, enum: ['aadhaar', 'pan', 'skill_certificate', 'shop_license'], required: true },
  url: { type: String, required: true },
  number: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
});

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    // Identity
    fullName: { type: String, trim: true },
    shopName: { type: String, trim: true },
    phone: { type: String, trim: true },
    mobileVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: '' },

    // Categories (multi-select)
    categories: [{ type: String }],

    // KYC Documents
    kycDocuments: [kycDocSchema],

    // Bio & Skills
    bio: { type: String, maxlength: 1000 },
    skills: [String],
    experienceYears: { type: Number, default: 0 },

    // Verification
    verificationStatus: {
      type: String,
      enum: ['pending_verification', 'verified', 'rejected', 'suspended'],
      default: 'pending_verification',
    },
    rejectionReason: { type: String, maxlength: 500 },
    verifiedAt: Date,

    // Location (auto-fetched via GPS)
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    locationUpdatedAt: { type: Date, default: Date.now },

    // Availability
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

    // Bank
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
      upiId: String,
    },

    // Stats
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    cancelledJobs: { type: Number, default: 0 },
    totalJobRequests: { type: Number, default: 0 },
    acceptedJobs: { type: Number, default: 0 },
    avgResponseTimeMinutes: { type: Number, default: 0 },
    customerSatisfactionScore: { type: Number, default: 0 },

    // Legacy / compatibility
    businessName: String,
    city: String,
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    serviceRadiusKm: { type: Number, default: 20 },
    shopPhoto: { type: String, default: '' },
    shopAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

providerSchema.index({ currentLocation: '2dsphere' });
providerSchema.index({ verificationStatus: 1, categories: 1 });
providerSchema.index({ user: 1 });

export default mongoose.model('Provider', providerSchema);
