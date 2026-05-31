import User from '../models/User.js';
import Provider from '../models/Provider.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const [totalUsers, totalProviders, totalBookings, payments, pendingBookings, pendingVerifications] =
    await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Provider.countDocuments(),
      Booking.countDocuments(),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Booking.countDocuments({ status: 'pending' }),
      ProviderProfile.countDocuments({ overallStatus: 'pending_approval' }),
    ]);

  const completed = await Booking.countDocuments({ status: 'completed' });
  const cancelled = await Booking.countDocuments({ status: 'cancelled' });

  const monthlyBookings = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().setDate(1)) },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProviders = await Provider.find()
    .populate('user', 'name avatar')
    .sort('-totalEarnings')
    .limit(5);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProviders,
      totalBookings,
      totalEarnings: payments[0]?.total || 0,
      pendingBookings,
      pendingVerifications,
      completed,
      cancelled,
      monthlyBookings,
      topProviders,
      userStats: {
        customers: await User.countDocuments({ role: 'customer', isBlocked: false }),
        providers: await User.countDocuments({ role: 'provider' }),
        blocked: await User.countDocuments({ isBlocked: true }),
      },
      bookingStats: {
        completed: await Booking.countDocuments({ status: 'completed' }),
        pending: await Booking.countDocuments({ status: 'pending' }),
        confirmed: await Booking.countDocuments({ status: 'confirmed' }),
        cancelled: await Booking.countDocuments({ status: 'cancelled' }),
      },
    },
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt').limit(100);
  res.json({ success: true, data: users });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: user });
});

export const approveProvider = catchAsync(async (req, res) => {
  const provider = await Provider.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: 'approved' },
    { new: true }
  ).populate('user', 'name email');
  res.json({ success: true, data: provider });
});

export const getProviders = catchAsync(async (req, res) => {
  const providers = await Provider.find()
    .populate('user', 'name email phone avatar')
    .sort('-createdAt');
  res.json({ success: true, data: providers });
});
