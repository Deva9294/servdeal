import Review from '../models/Review.js';
import Provider from '../models/Provider.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createReview = catchAsync(async (req, res) => {
  const review = await Review.create({
    ...req.body,
    customer: req.user._id,
  });
  const provider = await Provider.findById(req.body.provider);
  if (provider) {
    const reviews = await Review.find({ provider: provider._id, isVisible: true });
    provider.reviewCount = reviews.length;
    provider.rating =
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length || provider.rating;
    await provider.save();
  }
  res.status(201).json({ success: true, data: review });
});

export const getReviews = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.provider) filter.provider = req.query.provider;
  if (req.query.service) filter.service = req.query.service;
  const reviews = await Review.find(filter)
    .populate('customer', 'name avatar')
    .sort('-createdAt');
  res.json({ success: true, data: reviews });
});
