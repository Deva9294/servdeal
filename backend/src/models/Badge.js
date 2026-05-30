import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    icon: { type: String, default: 'award' },
    color: { type: String, default: '#f97316' },
    category: { type: String, enum: ['skill', 'safety', 'quality', 'experience', 'trust', 'special'], default: 'skill' },
    criteria: { type: String, trim: true },
    minJobs: { type: Number, default: 0 },
    minRating: { type: Number, default: 0 },
    minExperienceYears: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

badgeSchema.index({ slug: 1 });
badgeSchema.index({ category: 1 });

export default mongoose.model('Badge', badgeSchema);
