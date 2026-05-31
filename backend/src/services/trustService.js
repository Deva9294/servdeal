import TrustReport from '../models/TrustReport.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Provider from '../models/Provider.js';

/**
 * Detect suspicious patterns in reviews
 */
export const detectFakeReview = async (review) => {
  const issues = [];
  const { comment, rating, customer, provider } = review;

  const sameUserReviews = await Review.countDocuments({ customer, createdAt: { $gte: new Date(Date.now() - 86400000) } });
  if (sameUserReviews > 5) issues.push('too_many_reviews_24h');

  const sameProviderReviews = await Review.countDocuments({ customer, provider, createdAt: { $gte: new Date(Date.now() - 86400000 * 7) } });
  if (sameProviderReviews > 3) issues.push('repeated_provider_reviews');

  const allTextReviews = await Review.find({ provider, comment: { $exists: true } }).select('comment');
  const similarComments = allTextReviews.filter((r) => r.comment && comment && r.comment.length > 10 && similarity(comment, r.comment) > 0.85);
  if (similarComments.length > 2) issues.push('duplicate_comment_pattern');

  if (rating === 1 || rating === 5) {
    const extremeReviews = await Review.countDocuments({ customer, $or: [{ rating: 1 }, { rating: 5 }] });
    const totalReviews = await Review.countDocuments({ customer });
    if (totalReviews > 0 && extremeReviews / totalReviews > 0.9) issues.push('extreme_rating_pattern');
  }

  if (issues.length > 0) {
    await TrustReport.create({
      type: 'fake_review',
      severity: issues.length > 2 ? 'high' : 'medium',
      targetUser: customer,
      targetProvider: provider,
      targetReview: review._id,
      reason: issues.join(', '),
      aiConfidence: Math.min(0.5 + issues.length * 0.15, 0.95),
      metadata: { issues },
    });
  }

  return issues;
};

/**
 * Detect fake bookings
 */
export const detectFakeBooking = async (booking) => {
  const issues = [];
  const customerBookings = await Booking.countDocuments({
    customer: booking.customer,
    createdAt: { $gte: new Date(Date.now() - 86400000) },
  });
  if (customerBookings > 10) issues.push('excessive_bookings_24h');

  const cancelledRatio = await Booking.countDocuments({
    customer: booking.customer,
    status: 'cancelled',
    createdAt: { $gte: new Date(Date.now() - 86400000 * 7) },
  });
  if (customerBookings > 0 && cancelledRatio / customerBookings > 0.8) issues.push('high_cancellation_rate');

  if (issues.length > 0) {
    await TrustReport.create({
      type: 'fake_booking',
      severity: 'medium',
      targetUser: booking.customer,
      targetBooking: booking._id,
      reason: issues.join(', '),
      aiConfidence: Math.min(0.5 + issues.length * 0.2, 0.9),
      metadata: { issues },
    });
  }

  return issues;
};

/**
 * Detect duplicate accounts
 */
export const detectDuplicateAccount = async (user) => {
  const duplicates = await User.find({
    _id: { $ne: user._id },
    $or: [
      { phone: user.phone },
      { email: user.email },
    ],
  });

  if (duplicates.length > 0) {
    await TrustReport.create({
      type: 'duplicate_account',
      severity: 'high',
      targetUser: user._id,
      reason: 'Matching phone or email with existing account',
      aiConfidence: 0.95,
      metadata: { duplicateIds: duplicates.map((d) => d._id) },
    });
  }

  return duplicates;
};

/**
 * Simple text similarity using Levenshtein distance approximation
 */
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1;
  const costs = [];
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (shorter[i - 1] !== longer[j - 1]) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[longer.length] = lastValue;
  }
  return (longer.length - costs[longer.length]) / longer.length;
}
