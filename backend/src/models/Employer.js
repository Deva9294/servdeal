import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, trim: true },
    employerType: {
      type: String,
      enum: ['individual', 'business', 'contractor', 'industry'],
      default: 'individual',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [85.1376, 25.5941] }, // [lng, lat]
    },
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

employerSchema.index({ location: '2dsphere' });

export default mongoose.model('Employer', employerSchema);


