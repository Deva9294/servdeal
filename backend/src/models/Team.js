import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  role: { type: String, enum: ['leader', 'supervisor', 'member'], default: 'member' },
  skills: [{ type: String }],
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    members: [teamMemberSchema],
    skills: [{ type: String }],
    location: {
      city: String,
      state: String,
      lat: Number,
      lng: Number,
    },
    workingRadiusKm: { type: Number, default: 10 },
    isAvailable: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

teamSchema.index({ leader: 1 });
teamSchema.index({ isAvailable: 1, isPublic: 1 });
teamSchema.index({ 'location.city': 1 });

export default mongoose.model('Team', teamSchema);
