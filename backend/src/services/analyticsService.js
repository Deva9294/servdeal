import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Review from '../models/Review.js';

export const getAdminAnalytics = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [totalRevenue, totalBookings, activeProviders, totalUsers, topCategories] = await Promise.all([
    Payment.aggregate([{ $match: { status: 'paid', createdAt: { $gte: thirtyDaysAgo } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Provider.countDocuments({ isOnline: true }),
    User.countDocuments(),
    Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $group: { _id: '$service.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const commissionData = await Booking.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'paid' } },
    { $group: { _id: null, totalCommission: { $sum: '$commission' }, totalProviderEarning: { $sum: '$providerEarning' } } },
  ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    totalBookings,
    activeProviders,
    totalUsers,
    topCategories: topCategories.map((c) => ({ category: c._id, bookings: c.count })),
    commissionReport: commissionData[0] || { totalCommission: 0, totalProviderEarning: 0 },
    period: '30d',
  };
};

export const getProviderAnalytics = async (providerId) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [earnings, completedJobs, avgRating, monthlyStats] = await Promise.all([
    Booking.aggregate([
      { $match: { provider: providerId, status: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$providerEarning' } } },
    ]),
    Booking.countDocuments({ provider: providerId, status: 'completed' }),
    Review.aggregate([
      { $match: { provider: providerId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]),
    Booking.aggregate([
      { $match: { provider: providerId, createdAt: { $gte: new Date(now - 180 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } } },
          jobs: { $sum: 1 },
          earnings: { $sum: '$providerEarning' },
          rating: { $avg: '$customerSatisfactionScore' },
        },
      },
      { $sort: { '_id.month': -1 } },
      { $limit: 6 },
    ]),
  ]);

  return {
    earnings: earnings[0]?.total || 0,
    completedJobs,
    avgRating: Math.round((avgRating[0]?.avg || 0) * 100) / 100,
    monthlyStats: monthlyStats.map((m) => ({
      month: m._id.month,
      jobs: m.jobs,
      earnings: m.earnings,
      rating: Math.round((m.rating || 0) * 100) / 100,
    })),
  };
};

export const getCustomerAnalytics = async (userId) => {
  const [bookingHistory, totalSpent, favoriteProviders] = await Promise.all([
    Booking.find({ customer: userId }).sort('-createdAt').limit(10).populate('service', 'name').populate('provider', 'businessName'),
    Booking.aggregate([{ $match: { customer: userId, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.aggregate([
      { $match: { customer: userId, provider: { $ne: null } } },
      { $group: { _id: '$provider', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
  ]);

  return {
    bookingHistory,
    totalSpent: totalSpent[0]?.total || 0,
    favoriteProviders: favoriteProviders.map((f) => ({ providerId: f._id, bookings: f.count })),
  };
};
