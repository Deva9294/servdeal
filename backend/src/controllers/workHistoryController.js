import WorkHistory from '../models/WorkHistory.js';
import Worker from '../models/Worker.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createEntry = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const entry = await WorkHistory.create({
    worker: worker._id,
    user: req.user._id,
    ...req.body,
  });

  res.status(201).json({ success: true, entry });
});

export const getMyHistory = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const { page = 1, limit = 20 } = req.query;
  const entries = await WorkHistory.find({ worker: worker._id })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await WorkHistory.countDocuments({ worker: worker._id });

  res.json({ success: true, entries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getPortfolio = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.params.workerId });
  if (!worker) throw new AppError('Worker not found', 404);

  const entries = await WorkHistory.find({ worker: worker._id, isPublic: true })
    .sort({ isFeatured: -1, createdAt: -1 })
    .limit(20);

  res.json({ success: true, entries, workerName: worker.name });
});

export const updateEntry = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  const entry = await WorkHistory.findOneAndUpdate(
    { _id: req.params.id, worker: worker?._id },
    req.body,
    { new: true }
  );
  if (!entry) throw new AppError('Entry not found', 404);
  res.json({ success: true, entry });
});

export const deleteEntry = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  const entry = await WorkHistory.findOneAndDelete({ _id: req.params.id, worker: worker?._id });
  if (!entry) throw new AppError('Entry not found', 404);
  res.json({ success: true, message: 'Deleted' });
});
