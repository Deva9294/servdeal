import Badge from '../models/Badge.js';
import Worker from '../models/Worker.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getBadges = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const badges = await Badge.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: badges.length, badges });
});

export const getBadge = catchAsync(async (req, res) => {
  const badge = await Badge.findOne({ slug: req.params.slug });
  if (!badge) throw new AppError('Badge not found', 404);
  res.json({ success: true, badge });
});

export const createBadge = catchAsync(async (req, res) => {
  const badge = await Badge.create(req.body);
  res.status(201).json({ success: true, badge });
});

export const getMyBadges = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id }).populate({
    path: 'badges.badge',
    model: 'Badge',
    select: 'name icon color category description',
  });
  if (!worker) throw new AppError('Worker profile not found', 404);
  res.json({ success: true, badges: worker.badges || [] });
});

export const awardBadge = catchAsync(async (req, res) => {
  const { workerId, badgeId } = req.body;
  const badge = await Badge.findById(badgeId);
  if (!badge) throw new AppError('Badge not found', 404);

  const worker = await Worker.findById(workerId);
  if (!worker) throw new AppError('Worker not found', 404);

  const alreadyHas = worker.badges?.some((b) => String(b.badge) === badgeId);
  if (alreadyHas) throw new AppError('Worker already has this badge', 400);

  worker.badges = worker.badges || [];
  worker.badges.push({ badge: badgeId, awardedAt: new Date(), verifiedBy: req.user._id });
  await worker.save();

  res.json({ success: true, message: `${badge.name} awarded` });
});

export const revokeBadge = catchAsync(async (req, res) => {
  const { workerId, badgeId } = req.body;
  const worker = await Worker.findById(workerId);
  if (!worker) throw new AppError('Worker not found', 404);

  worker.badges = (worker.badges || []).filter((b) => String(b.badge) !== badgeId);
  await worker.save();

  res.json({ success: true, message: 'Badge revoked' });
});
