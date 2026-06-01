import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const registerProvider = catchAsync(async (req, res) => {
  let provider = await Provider.findOne({ user: req.user._id });

  // Resolve service slugs to ObjectIds
  let serviceIds = [];
  if (Array.isArray(req.body.services) && req.body.services.length > 0) {
    const slugs = req.body.services.filter((s) => typeof s === 'string');
    const found = await Service.find({ slug: { $in: slugs } }).select('_id slug');
    serviceIds = found.map((s) => s._id);
  }

  const updateData = {
    businessName: req.body.businessName,
    experienceYears: req.body.experienceYears,
    bio: req.body.bio,
    services: serviceIds,
    bankDetails: req.body.bankDetails,
    city: req.body.city || req.user?.city,
    documents: req.body.documents || [],
    currentLocation: req.body.location
      ? { type: 'Point', coordinates: [req.body.location.lng, req.body.location.lat] }
      : undefined,
  };

  if (provider) {
    // Upsert existing provider document
    Object.assign(provider, updateData);
    await provider.save();
  } else {
    await User.findByIdAndUpdate(req.user._id, { role: 'provider' });
    provider = await Provider.create({
      user: req.user._id,
      ...updateData,
    });
  }

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
  const update = { ...req.body };

  // Convert service slugs to ObjectIds if services array is provided
  if (Array.isArray(update.services)) {
    const slugs = update.services.filter((s) => typeof s === 'string');
    const found = await Service.find({ slug: { $in: slugs } }).select('_id slug');
    update.services = found.map((s) => s._id);
  }

  // Convert location to GeoJSON Point if provided
  if (update.location && update.location.lat != null && update.location.lng != null) {
    update.currentLocation = { type: 'Point', coordinates: [update.location.lng, update.location.lat] };
    delete update.location;
  }

  const provider = await Provider.findOneAndUpdate({ user: req.user._id }, update, {
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
  const hasCoords = lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng));

  let providers = [];

  if (hasCoords) {
    // Geospatial query for providers with location
    const nearby = await Provider.find({
      verificationStatus: 'approved',
      currentLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius) * 1000,
        },
      },
    })
      .populate('user', 'name avatar')
      .populate('services', 'name slug icon color basePrice')
      .limit(20);
    providers = nearby;
  }

  // Fallback: also include approved providers without exact coordinates or if no coords provided
  if (providers.length === 0) {
    const fallback = await Provider.find({ verificationStatus: 'approved' })
      .populate('user', 'name avatar')
      .populate('services', 'name slug icon color basePrice')
      .sort('-rating')
      .limit(20);
    providers = fallback;
  }

  res.json({ success: true, data: providers });
});
