import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

/**
 * Calculate distance between two coordinates in km using Haversine formula
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate normalized distance score (closer = higher score)
 */
const calculateDistanceScore = (distanceKm, maxRadius = 20) => {
  if (distanceKm <= 0) return 1;
  if (distanceKm >= maxRadius) return 0;
  return 1 - distanceKm / maxRadius;
};

/**
 * Calculate normalized rating score
 */
const calculateRatingScore = (rating, reviewCount) => {
  if (!reviewCount) return 0.5;
  const normalizedRating = rating / 5;
  const confidence = Math.min(reviewCount / 50, 1);
  return normalizedRating * confidence + 0.5 * (1 - confidence);
};

/**
 * Calculate job completion score
 */
const calculateJobCompletionScore = (completed, total) => {
  if (!total) return 0.5;
  return completed / total;
};

/**
 * Calculate response time score (faster = higher)
 */
const calculateResponseTimeScore = (avgResponseTimeMinutes) => {
  if (!avgResponseTimeMinutes || avgResponseTimeMinutes <= 0) return 1;
  const score = 1 - avgResponseTimeMinutes / 60;
  return Math.max(0, Math.min(1, score));
};

/**
 * Calculate availability score
 */
const calculateAvailabilityScore = (isOnline, lastOnlineAt) => {
  if (isOnline) return 1;
  if (!lastOnlineAt) return 0.3;
  const minutesSinceOnline = (Date.now() - new Date(lastOnlineAt).getTime()) / 60000;
  if (minutesSinceOnline < 30) return 0.8;
  if (minutesSinceOnline < 120) return 0.5;
  return 0.3;
};

/**
 * Calculate acceptance rate score
 */
const calculateAcceptanceRateScore = (accepted, totalRequests) => {
  if (!totalRequests) return 0.5;
  return accepted / totalRequests;
};

/**
 * Final Ranking Formula:
 * Distance(35%) + Rating(25%) + Jobs(15%) + ResponseTime(10%) + Availability(10%) + Acceptance(5%)
 */
export const calculateProviderScore = (provider, customerLat, customerLng) => {
  const distanceKm = calculateDistance(
    customerLat,
    customerLng,
    provider.currentLocation?.coordinates?.[1] || 0,
    provider.currentLocation?.coordinates?.[0] || 0
  );

  const distanceScore = calculateDistanceScore(distanceKm, provider.serviceRadiusKm || 20);
  const ratingScore = calculateRatingScore(provider.rating || 0, provider.reviewCount || 0);
  const jobCompletionScore = calculateJobCompletionScore(
    provider.completedJobs || 0,
    (provider.completedJobs || 0) + (provider.cancelledJobs || 0) || 1
  );
  const responseTimeScore = calculateResponseTimeScore(provider.avgResponseTimeMinutes);
  const availabilityScore = calculateAvailabilityScore(provider.isOnline, provider.lastOnlineAt);
  const acceptanceRateScore = calculateAcceptanceRateScore(
    provider.acceptedJobs || 0,
    provider.totalJobRequests || 1
  );

  const finalScore =
    distanceScore * 0.35 +
    ratingScore * 0.25 +
    jobCompletionScore * 0.15 +
    responseTimeScore * 0.10 +
    availabilityScore * 0.10 +
    acceptanceRateScore * 0.05;

  return {
    providerId: provider._id,
    distanceKm: Math.round(distanceKm * 100) / 100,
    finalScore: Math.round(finalScore * 1000) / 1000,
    breakdown: {
      distanceScore: Math.round(distanceScore * 100) / 100,
      ratingScore: Math.round(ratingScore * 100) / 100,
      jobCompletionScore: Math.round(jobCompletionScore * 100) / 100,
      responseTimeScore: Math.round(responseTimeScore * 100) / 100,
      availabilityScore: Math.round(availabilityScore * 100) / 100,
      acceptanceRateScore: Math.round(acceptanceRateScore * 100) / 100,
    },
  };
};

/**
 * Find and rank nearby providers for a given service and location
 */
export const findRankedProviders = async ({
  serviceId,
  customerLat,
  customerLng,
  radiusKm = 20,
  limit = 20,
}) => {
  const providers = await Provider.find({
    services: serviceId,
    verificationStatus: 'approved',
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [customerLng, customerLat],
        },
        $maxDistance: radiusKm * 1000,
      },
    },
  }).limit(limit * 2);

  const scored = providers.map((p) => calculateProviderScore(p, customerLat, customerLng));
  scored.sort((a, b) => b.finalScore - a.finalScore);

  const rankedProviders = scored.slice(0, limit);
  const providerIds = rankedProviders.map((s) => s.providerId);
  const fullProviders = await Provider.find({ _id: { $in: providerIds } })
    .populate('user', 'name phone avatar')
    .populate('services', 'name');

  const providerMap = new Map(fullProviders.map((p) => [String(p._id), p]));

  return rankedProviders.map((s) => ({
    ...s,
    provider: providerMap.get(String(s.providerId)),
  }));
};

/**
 * Update provider analytics after job completion
 */
export const updateProviderStats = async (providerId) => {
  const provider = await Provider.findById(providerId);
  if (!provider) return;

  const completed = await Booking.countDocuments({ provider: providerId, status: 'completed' });
  const cancelled = await Booking.countDocuments({ provider: providerId, status: 'cancelled' });
  const totalRequests = await Booking.countDocuments({ provider: providerId });
  const accepted = totalRequests - cancelled;

  const avgRating = await Review.aggregate([
    { $match: { provider: providerId } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);

  provider.completedJobs = completed;
  provider.cancelledJobs = cancelled;
  provider.totalJobRequests = totalRequests;
  provider.acceptedJobs = accepted;
  provider.rating = avgRating[0]?.avg || provider.rating || 0;
  provider.reviewCount = await Review.countDocuments({ provider: providerId });

  if (totalRequests > 0) {
    provider.acceptedJobs = accepted;
  }

  await provider.save();
};
