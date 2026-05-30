import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  type: { type: String, enum: ['aadhaar', 'pan', 'driving_license', 'certificate', 'skill_proof'] },
  url: { type: String, required: true },
  publicId: { type: String },
  verified: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  ifscCode: { type: String, trim: true, uppercase: true },
  bankName: { type: String, trim: true },
  branchName: { type: String, trim: true },
  upiId: { type: String, trim: true },
  verified: { type: Boolean, default: false },
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  experienceYears: { type: Number, min: 0, max: 50 },
  hourlyRate: { type: Number, min: 0 },
  description: { type: String, trim: true },
  certificates: [documentSchema],
});

const workScheduleSchema = new mongoose.Schema({
  day: { type: String, enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'], required: true },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '18:00' },
  isAvailable: { type: Boolean, default: true },
});

const providerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  // Identity & KYC
  aadhaarNumber: { type: String, trim: true, sparse: true },
  aadhaarDoc: documentSchema,
  panNumber: { type: String, trim: true, uppercase: true, sparse: true },
  panDoc: documentSchema,

  // Personal Details
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  primaryServiceArea: { type: String, default: '' },
  maxTravelDistanceKm: { type: Number, default: 10 },

  // Skills & Services
  skills: [skillSchema],
  primaryCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  bio: { type: String, maxlength: 1000 },
  languages: [{ type: String, trim: true }],

  // Banking
  bankDetails: bankDetailsSchema,

  // Work Schedule & Availability
  isAvailable: { type: Boolean, default: true },
  schedule: [workScheduleSchema],
  emergencyAvailable: { type: Boolean, default: false },

  // Verification Status
  kycStatus: { type: String, enum: ['pending', 'submitted', 'under_review', 'verified', 'rejected'], default: 'pending' },
  bankStatus: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected'], default: 'pending' },
  overallStatus: { type: String, enum: ['incomplete', 'pending_approval', 'approved', 'rejected', 'suspended'], default: 'incomplete' },

  // Admin notes
  adminNotes: { type: String, maxlength: 2000 },
  rejectionReason: { type: String, maxlength: 500 },

  // Stats
  totalJobs: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },

}, { timestamps: true });

// Indexes
providerProfileSchema.index({ user: 1 });
providerProfileSchema.index({ overallStatus: 1 });
providerProfileSchema.index({ 'skills.name': 1 });

export default mongoose.model('ProviderProfile', providerProfileSchema);
