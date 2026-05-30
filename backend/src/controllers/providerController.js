import Provider from '../models/Provider.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const registerProvider = catchAsync(async (req, res) => {
  const existing = await Provider.findOne({ user: req.user._id });
  if (existing) throw new AppError('Provider profile already exists', 400);

  await User.findByIdAndUpdate(req.user._id, { role: 'provider' });

  const provider = await Provider.create({
    user: req.user._id,
    businessName: req.body.businessName,
    experienceYears: req.body.experienceYears,
    bio: req.body.bio,
    services: req.body.services,
    bankDetails: req.body.bankDetails,
    city: req.body.city || req.user.city,
    documents: req.body.documents || [],
    currentLocation: req.body.location
      ? { type: 'Point', coordinates: [req.body.location.lng, req.body.location.lat] }
      : undefined,
  });

  res.status(201).json({ success: true, data: provider });
});

export const getMyProviderProfile = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id })
    .populate('services')
    .populate('user', 'name email phone avatar');
  if (!provider) throw new AppError('Provider profile not found', 404);
  res.json({ success: true, data: provider });
});

export const updateProvider = catchAsync(async (req, res) => {
  const provider = await Provider.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
  });
  res.json({ success: true, data: provider });
});

export const toggleOnline = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  provider.isOnline = !provider.isOnline;
  await provider.save();
  res.json({ success: true, data: { isOnline: provider.isOnline } });
});

export const getNearbyProviders = catchAsync(async (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  const providers = await Provider.find({
    verificationStatus: 'approved',
    isOnline: true,
    currentLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius) * 1000,
      },
    },
  })
    .populate('user', 'name avatar')
    .limit(20);
  res.json({ success: true, data: providers });
});
