import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  timeSpentMinutes: { type: Number, default: 0 },
});

const trainingEnrollmentSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainingCourse', required: true },
    progress: [progressSchema],
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
      default: 'enrolled',
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: Date,
    certificateUrl: String,
    certificateId: String,
    score: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

trainingEnrollmentSchema.index({ worker: 1, status: 1 });
trainingEnrollmentSchema.index({ course: 1 });
trainingEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('TrainingEnrollment', trainingEnrollmentSchema);
