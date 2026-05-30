import Employer from '../models/Employer.js';
import JobPost from '../models/JobPost.js';
import Worker from '../models/Worker.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createJobPost = catchAsync(async (req, res) => {
  const employer = await Employer.findOne({ user: req.user._id });
  if (!employer) throw new AppError('Employer profile not found', 404);

  const job = await JobPost.create({
    employer: employer._id,
    ...req.body,
  });

  res.status(201).json({ success: true, job });
});

export const listJobPosts = catchAsync(async (req, res) => {
  const { lng, lat, radiusKm = 20, status = 'open' } = req.query;

  const query = { status };
  if (lng && lat) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radiusKm) * 1000,
      },
    };
  }

  const jobs = await JobPost.find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate({
      path: 'employer',
      populate: { path: 'user', select: 'name phone city' },
    })
    .populate('skills', 'name category');

  res.json({ success: true, count: jobs.length, jobs });
});

export const getMyPostedJobs = catchAsync(async (req, res) => {
  const employer = await Employer.findOne({ user: req.user._id });
  if (!employer) throw new AppError('Employer profile not found', 404);

  const jobs = await JobPost.find({ employer: employer._id })
    .sort({ createdAt: -1 })
    .populate('skills', 'name category')
    .populate('applicants', 'user skills ratingAvg');

  res.json({ success: true, count: jobs.length, jobs });
});

export const applyToJob = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const job = await JobPost.findById(req.params.id);
  if (!job) throw new AppError('Job not found', 404);
  if (job.status !== 'open') throw new AppError('Job is not open for applications', 400);

  if (!job.applicants.some((id) => id.toString() === worker._id.toString())) {
    job.applicants.push(worker._id);
    await job.save();
  }

  res.json({ success: true, message: 'Applied successfully' });
});


