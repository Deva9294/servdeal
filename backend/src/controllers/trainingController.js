import TrainingCourse from '../models/TrainingCourse.js';
import TrainingEnrollment from '../models/TrainingEnrollment.js';
import Worker from '../models/Worker.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getCourses = catchAsync(async (req, res) => {
  const { category, level } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (level) filter.level = level;

  const courses = await TrainingCourse.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, courses });
});

export const getCourse = catchAsync(async (req, res) => {
  const course = await TrainingCourse.findOne({ slug: req.params.slug });
  if (!course) throw new AppError('Course not found', 404);
  res.json({ success: true, course });
});

export const enrollCourse = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile required', 404);

  const course = await TrainingCourse.findById(req.params.courseId);
  if (!course) throw new AppError('Course not found', 404);

  const existing = await TrainingEnrollment.findOne({ worker: worker._id, course: course._id });
  if (existing) throw new AppError('Already enrolled', 400);

  const enrollment = await TrainingEnrollment.create({
    worker: worker._id,
    user: req.user._id,
    course: course._id,
  });

  await TrainingCourse.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

  res.status(201).json({ success: true, enrollment });
});

export const getMyEnrollments = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const enrollments = await TrainingEnrollment.find({ worker: worker._id })
    .populate('course', 'title slug category level image certificateTemplate')
    .sort({ createdAt: -1 });

  res.json({ success: true, enrollments });
});

export const updateProgress = catchAsync(async (req, res) => {
  const { lessonId, completed, timeSpentMinutes } = req.body;
  const worker = await Worker.findOne({ user: req.user._id });

  const enrollment = await TrainingEnrollment.findOne({ _id: req.params.id, worker: worker?._id });
  if (!enrollment) throw new AppError('Enrollment not found', 404);

  const lessonProgress = enrollment.progress.find((p) => String(p.lessonId) === lessonId);
  if (lessonProgress) {
    lessonProgress.completed = completed;
    if (completed) lessonProgress.completedAt = new Date();
    lessonProgress.timeSpentMinutes = timeSpentMinutes || 0;
  } else {
    enrollment.progress.push({ lessonId, completed, completedAt: completed ? new Date() : undefined, timeSpentMinutes: timeSpentMinutes || 0 });
  }

  const course = await TrainingCourse.findById(enrollment.course);
  const totalLessons = course?.lessons?.length || 1;
  const completedLessons = enrollment.progress.filter((p) => p.completed).length;
  enrollment.overallProgress = Math.round((completedLessons / totalLessons) * 100);

  if (enrollment.overallProgress >= 100 && enrollment.status !== 'completed') {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date();
    enrollment.certificateId = `CERT-${Date.now()}`;
    await TrainingCourse.findByIdAndUpdate(enrollment.course, { $inc: { completedCount: 1 } });
  } else if (enrollment.status === 'enrolled' && enrollment.overallProgress > 0) {
    enrollment.status = 'in_progress';
  }

  await enrollment.save();
  res.json({ success: true, enrollment });
});

export const createCourse = catchAsync(async (req, res) => {
  const course = await TrainingCourse.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, course });
});
