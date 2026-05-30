import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema(
  {
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    workType: {
      type: String,
      enum: ['one-time', 'daily', 'contract', 'full-time', 'part-time', 'urgent'],
      default: 'one-time',
    },
    paymentType: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'per-task', 'hourly'],
      default: 'daily',
    },
    budgetMin: { type: Number, min: 0, default: 0 },
    budgetMax: { type: Number, min: 0, default: 0 },
    workerCount: { type: Number, min: 1, default: 1 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [85.1376, 25.5941] }, // [lng, lat]
    },
    city: { type: String, default: 'Patna' },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }],
  },
  { timestamps: true }
);

jobPostSchema.index({ location: '2dsphere' });
jobPostSchema.index({ status: 1, paymentType: 1, workType: 1 });

export default mongoose.model('JobPost', jobPostSchema);


