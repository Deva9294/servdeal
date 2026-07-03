import Provider from '../models/Provider.js';
import ProviderAnalytics from '../models/ProviderAnalytics.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { catchAsync } from '../utils/catchAsync.js';

const buildProviderLeaderboard = async (filter = {}, sortField = 'rating', limit = 50) => {
  const providers = await Provider.find({ verificationStatus: 'approved', ...filter })
    .populate('user', 'name avatar')
    .populate('services', 'name')
    .sort({ [sortField]: -1, completedJobs: -1 })
    .limit(limit);

  const enriched = await Promise.all(
    providers.map(async (p, index) => {
      const analytics = await ProviderAnalytics.findOne({ provider: p._id });
      const totalReviews = await Review.countDocuments({ provider: p._id });
      const recentJobs = await Booking.countDocuments({
        provider: p._id,
        status: 'completed',
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      });

      return {
        rank: index + 1,
        providerId: p._id,
        name: p.user?.name || p.businessName || 'Unknown',
        avatar: p.user?.avatar || '',
        city: p.city || '',
        services: p.services?.map((s) => s.name) || [],
        rating: Math.round((p.rating || 0) * 10) / 10,
        reviewCount: totalReviews,
        completedJobs: p.completedJobs || 0,
        totalEarnings: p.totalEarnings || 0,
        responseTimeMinutes: p.avgResponseTimeMinutes || 0,
        recentJobs,
        acceptanceRate: analytics?.acceptanceRate || 0,
        customerSatisfactionScore: analytics?.customerSatisfactionScore || 0,
        badges: p.badges || [],
        isFeatured: p.isFeatured,
      };
    })
  );

  return enriched;
};

export const getCityLeaderboard = catchAsync(async (req, res) => {
  const { city, limit = 50 } = req.query;
  const filter = city 
    ? { city: new RegExp(city.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i') } 
    : {};
  const data = await buildProviderLeaderboard(filter, 'rating', Number(limit));
  res.json({ success: true, data });
});

export const getCategoryLeaderboard = catchAsync(async (req, res) => {
  const { serviceId, limit = 50 } = req.query;
  const filter = serviceId ? { services: serviceId } : {};
  const data = await buildProviderLeaderboard(filter, 'rating', Number(limit));
  res.json({ success: true, data });
});

export const getTopProviders = catchAsync(async (req, res) => {
  const { limit = 10, city, serviceId } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(city.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'i');
  if (serviceId) filter.services = serviceId;

  const data = await buildProviderLeaderboard(filter, 'completedJobs', Number(limit));
  res.json({ success: true, data });
});

export const getProviderRank = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) return res.json({ success: true, data: null });

  const allProviders = await Provider.find({ verificationStatus: 'approved', city: provider.city })
    .sort({ rating: -1, completedJobs: -1 });

  const rank = allProviders.findIndex((p) => String(p._id) === String(provider._id)) + 1;
  const total = allProviders.length;

  res.json({
    success: true,
    data: {
      rank,
      total,
      percentile: total > 0 ? Math.round(((total - rank) / total) * 100) : 0,
      providerId: provider._id,
    },
  });
});
