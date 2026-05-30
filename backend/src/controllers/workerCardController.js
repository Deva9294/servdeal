import WorkerCard from '../models/WorkerCard.js';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

const generateCardId = () => `SD${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

export const createCard = catchAsync(async (req, res) => {
  const existing = await WorkerCard.findOne({ worker: req.user._id });
  if (existing) throw new AppError('Worker card already exists', 400);

  const worker = await Worker.findOne({ user: req.user._id }).populate('skills', 'name');
  if (!worker) throw new AppError('Worker profile not found', 404);

  const user = await User.findById(req.user._id);

  const card = await WorkerCard.create({
    worker: worker._id,
    cardId: generateCardId(),
    name: user.name,
    photo: user.avatar,
    skills: worker.skills.map((s) => (typeof s === 'string' ? s : s.name)),
    rating: worker.ratingAvg,
    totalJobs: worker.ratingCount,
    trustScore: worker.trustScore,
  });

  res.status(201).json({ success: true, card });
});

export const getMyCard = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const card = await WorkerCard.findOne({ worker: worker._id });
  if (!card) throw new AppError('Worker card not found', 404);

  res.json({ success: true, card });
});

export const getCardById = catchAsync(async (req, res) => {
  const card = await WorkerCard.findOne({ cardId: req.params.cardId })
    .populate('worker', 'experienceYears availabilityType')
    .populate('verifiedBy', 'name');

  if (!card || !card.isActive) throw new AppError('Card not found', 404);
  res.json({ success: true, card });
});

export const updateCard = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const allowed = ['emergencyContact', 'bloodGroup', 'photo'];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const card = await WorkerCard.findOneAndUpdate({ worker: worker._id }, updates, { new: true });
  if (!card) throw new AppError('Worker card not found', 404);

  res.json({ success: true, card });
});

export const verifyCard = catchAsync(async (req, res) => {
  const card = await WorkerCard.findByIdAndUpdate(
    req.params.id,
    { verified: true, verifiedBy: req.user._id, verificationDate: new Date() },
    { new: true }
  );
  if (!card) throw new AppError('Card not found', 404);
  res.json({ success: true, card });
});

export const deactivateCard = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  const card = await WorkerCard.findOneAndUpdate(
    { worker: worker?._id },
    { isActive: false },
    { new: true }
  );
  if (!card) throw new AppError('Card not found', 404);
  res.json({ success: true, card });
});
