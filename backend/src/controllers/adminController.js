import User from '../models/User.js';
import Provider from '../models/Provider.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import WalletTransaction from '../models/WalletTransaction.js';
import PaymentLog from '../models/PaymentLog.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalProviders, totalBookings, payments, pendingBookings, pendingVerifications, walletStats, failedPaymentsToday, walletVolume] =
    await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'provider' }),
      Booking.countDocuments(),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Booking.countDocuments({ status: 'pending' }),
      ProviderProfile.countDocuments({ overallStatus: 'pending_approval' }),
      WalletTransaction.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      PaymentLog.countDocuments({ status: { $in: ['failed', 'duplicate'] }, createdAt: { $gte: today } }),
      WalletTransaction.aggregate([
        { $match: { status: 'success', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
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
        providers: totalProviders,
        blocked: await User.countDocuments({ isBlocked: true }),
      },
      bookingStats: {
        completed: await Booking.countDocuments({ status: 'completed' }),
        pending: await Booking.countDocuments({ status: 'pending' }),
        confirmed: await Booking.countDocuments({ status: 'confirmed' }),
        cancelled: await Booking.countDocuments({ status: 'cancelled' }),
      },
      walletStats: {
        totalCredited: walletStats.find((s) => s._id === 'credit')?.total || 0,
        totalDebited: walletStats.find((s) => s._id === 'debit')?.total || 0,
        totalTransactions: walletStats.reduce((sum, s) => sum + s.count, 0),
        todayVolume: walletVolume[0]?.total || 0,
        todayCount: walletVolume[0]?.count || 0,
        failedPaymentsToday,
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
  let provider = await Provider.findById(req.params.id);
  if (provider) {
    provider.verificationStatus = 'approved';
    await provider.save();
  } else {
    // Try to find by user id or create new Provider document
    const userProvider = await User.findById(req.params.id);
    if (userProvider) {
      provider = await Provider.create({
        user: userProvider._id,
        verificationStatus: 'approved',
        city: userProvider.city || '',
      });
    }
  }
  if (!provider) throw new AppError('Provider not found', 404);
  await provider.populate('user', 'name email');
  res.json({ success: true, data: provider });
});

export const getProviders = catchAsync(async (req, res) => {
  const providers = await Provider.find()
    .populate('user', 'name email phone avatar')
    .sort('-createdAt');
  res.json({ success: true, data: providers });
});

export const getCustomerRetentionAnalytics = catchAsync(async (req, res) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

  const totalCustomers = await User.countDocuments({ role: 'customer' });

  // Repeat customers (more than 1 booking)
  const repeatCustomersAgg = await Booking.aggregate([
    { $match: { status: { $in: ['completed', 'paid'] } } },
    { $group: { _id: '$customer', bookingCount: { $sum: 1 } } },
    { $match: { bookingCount: { $gt: 1 } } },
    { $count: 'count' },
  ]);
  const repeatCustomers = repeatCustomersAgg[0]?.count || 0;

  // Active in last 30 days
  const active30d = await Booking.distinct('customer', { createdAt: { $gte: thirtyDaysAgo }, status: { $in: ['completed', 'confirmed', 'paid'] } });
  // Active in last 30-60 days
  const active60d = await Booking.distinct('customer', {
    createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    status: { $in: ['completed', 'confirmed', 'paid'] },
  });
  // Active in last 60-90 days
  const active90d = await Booking.distinct('customer', {
    createdAt: { $gte: ninetyDaysAgo, $lt: sixtyDaysAgo },
    status: { $in: ['completed', 'confirmed', 'paid'] },
  });

  // Churned = active 60-90 days ago but NOT active in last 30 days
  const churnedCustomers = active90d.filter((id) => !active30d.some((a) => String(a) === String(id)));
  const churnRate = active90d.length > 0 ? Math.round((churnedCustomers.length / active90d.length) * 100) : 0;

  // Monthly retention trend
  const monthlyRetention = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthCustomers = await Booking.distinct('customer', {
      createdAt: { $gte: monthStart, $lt: monthEnd },
      status: { $in: ['completed', 'confirmed', 'paid'] },
    });
    const monthRepeaters = await Booking.aggregate([
      { $match: { customer: { $in: monthCustomers }, status: { $in: ['completed', 'confirmed', 'paid'] } } },
      { $group: { _id: '$customer', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'count' },
    ]);
    monthlyRetention.push({
      month: monthStart.toLocaleString('en-IN', { month: 'short', year: 'numeric' }),
      totalCustomers: monthCustomers.length,
      repeatCustomers: monthRepeaters[0]?.count || 0,
      retentionRate: monthCustomers.length > 0 ? Math.round(((monthRepeaters[0]?.count || 0) / monthCustomers.length) * 100) : 0,
    });
  }

  // Average bookings per customer
  const avgBookingsAgg = await Booking.aggregate([
    { $match: { status: { $in: ['completed', 'confirmed', 'paid'] } } },
    { $group: { _id: '$customer', count: { $sum: 1 } } },
    { $group: { _id: null, avg: { $avg: '$count' } } },
  ]);
  const avgBookingsPerCustomer = Math.round((avgBookingsAgg[0]?.avg || 0) * 100) / 100;

  // Lifetime value (total spent per customer)
  const ltvAgg = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: '$customer', total: { $sum: '$amount' } } },
    { $group: { _id: null, avg: { $avg: '$total' } } },
  ]);
  const avgLifetimeValue = Math.round((ltvAgg[0]?.avg || 0) * 100) / 100;

  res.json({
    success: true,
    data: {
      totalCustomers,
      repeatCustomers,
      repeatRate: totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0,
      active30Days: active30d.length,
      churnRate,
      avgBookingsPerCustomer,
      avgLifetimeValue,
      monthlyRetention,
    },
  });
});
