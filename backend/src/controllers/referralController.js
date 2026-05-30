import ReferralReward from '../models/ReferralReward.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Notification from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getMyReferrals = catchAsync(async (req, res) => {
  const rewards = await ReferralReward.find({ referrer: req.user._id })
    .populate('referee', 'name avatar createdAt')
    .sort({ createdAt: -1 });

  const totalEarned = rewards
    .filter((r) => r.status === 'credited')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingCount = rewards.filter((r) => r.status === 'pending').length;

  res.json({ success: true, rewards, totalEarned, pendingCount, totalCount: rewards.length });
});

export const claimReferral = catchAsync(async (req, res) => {
  const { code } = req.body;
  const referrer = await User.findOne({ referralCode: code });
  if (!referrer) throw new AppError('Invalid referral code', 400);
  if (String(referrer._id) === String(req.user._id)) throw new AppError('Cannot use your own code', 400);

  const existing = await ReferralReward.findOne({ referee: req.user._id });
  if (existing) throw new AppError('You have already used a referral code', 400);

  const reward = await ReferralReward.create({
    referrer: referrer._id,
    referee: req.user._id,
    referrerCode: code,
    amount: 50,
    trigger: 'signup',
  });

  // Credit referrer
  let wallet = await Wallet.findOne({ user: referrer._id });
  if (!wallet) wallet = await Wallet.create({ user: referrer._id });
  wallet.balance += 50;
  wallet.transactions.push({ type: 'credit', amount: 50, description: 'Referral reward' });
  await wallet.save();

  reward.status = 'credited';
  reward.creditedAt = new Date();
  await reward.save();

  const io = req.app.get('io');
  await Notification.create({
    user: referrer._id,
    title: 'Referral Reward',
    message: 'You earned ₹50 for a new signup!',
    type: 'referral',
    link: '/dashboard/refer',
  });
  io?.to(`user:${referrer._id}`).emit('notification', {
    title: 'Referral Reward',
    message: 'You earned ₹50 for a new signup!',
  });

  res.json({ success: true, reward });
});

export const processBookingReferral = catchAsync(async (req, res) => {
  const { userId, bookingId } = req.body;
  const user = await User.findById(userId);
  if (!user?.referredBy) return res.json({ success: true, message: 'No referrer' });

  const existing = await ReferralReward.findOne({ referee: userId, trigger: 'first_booking' });
  if (existing) return res.json({ success: true, message: 'Already processed' });

  const reward = await ReferralReward.create({
    referrer: user.referredBy,
    referee: userId,
    referrerCode: user.referralCode || '',
    amount: 100,
    trigger: 'first_booking',
    booking: bookingId,
  });

  let wallet = await Wallet.findOne({ user: user.referredBy });
  if (!wallet) wallet = await Wallet.create({ user: user.referredBy });
  wallet.balance += 100;
  wallet.transactions.push({ type: 'credit', amount: 100, description: 'Referral booking reward' });
  await wallet.save();

  reward.status = 'credited';
  reward.creditedAt = new Date();
  await reward.save();

  const io = req.app.get('io');
  await Notification.create({
    user: user.referredBy,
    title: 'Referral Booking Reward',
    message: 'You earned ₹100 for a referral booking!',
    type: 'referral',
    link: '/dashboard/refer',
  });
  io?.to(`user:${user.referredBy}`).emit('notification', {
    title: 'Referral Booking Reward',
    message: 'You earned ₹100 for a referral booking!',
  });

  res.json({ success: true, reward });
});
