import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: String,
  documentUrl: String,
  durationMinutes: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

const trainingCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    category: { type: String, enum: ['skill', 'safety', 'business', 'technical', 'soft_skills'], default: 'skill' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    image: String,
    lessons: [lessonSchema],
    totalDurationMinutes: { type: Number, default: 0 },
    certificateTemplate: String,
    isCertified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

trainingCourseSchema.index({ slug: 1 });
trainingCourseSchema.index({ category: 1, level: 1 });
trainingCourseSchema.index({ isActive: 1 });

export default mongoose.model('TrainingCourse', trainingCourseSchema);
