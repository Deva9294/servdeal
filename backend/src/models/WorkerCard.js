import mongoose from 'mongoose';

const workerCardSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true, unique: true },
    cardId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    photo: String,
    skills: [{ type: String }],
    qrCode: String,
    issueDate: { type: Date, default: Date.now },
    expiryDate: Date,
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verificationDate: Date,
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalJobs: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    emergencyContact: String,
    bloodGroup: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

workerCardSchema.index({ cardId: 1 });
workerCardSchema.index({ worker: 1 });

export default mongoose.model('WorkerCard', workerCardSchema);
