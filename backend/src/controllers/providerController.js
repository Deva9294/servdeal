import Provider from '../models/Provider.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

const kycChanged = (existingDocs, newDocs) => {
  if (!newDocs || !Array.isArray(newDocs)) return false;
  const oldTypes = new Set((existingDocs || []).map((d) => d.type));
  const newTypes = new Set(newDocs.map((d) => d.type));
  if (oldTypes.size !== newTypes.size) return true;
  for (const t of oldTypes) if (!newTypes.has(t)) return true;
  for (const t of newTypes) if (!oldTypes.has(t)) return true;
  return false;
};

export const registerProvider = catchAsync(async (req, res) => {
  const {
    fullName,
    shopName,
    phone,
    profilePicture,
    categories,
    kycDocuments,
    bio,
    skills,
    experienceYears,
    bankDetails,
    location,
  } = req.body;

  if (!location || location.lat == null || location.lng == null) {
    throw new AppError('Location is required. Enable GPS to auto-fetch coordinates.', 400);
  }
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    throw new AppError('Select at least one service category.', 400);
  }
  if (!kycDocuments || kycDocuments.length < 2) {
    throw new AppError('Upload Aadhaar, PAN and at least one business document.', 400);
  }

  const hasAadhaar = kycDocuments.some((d) => d.type === 'aadhaar');
  const hasPan = kycDocuments.some((d) => d.type === 'pan');
  const hasBusinessDoc = kycDocuments.some((d) => d.type === 'skill_certificate' || d.type === 'shop_license');
  if (!hasAadhaar || !hasPan || !hasBusinessDoc) {
    throw new AppError('Aadhaar, PAN and one business document are required.', 400);
  }

  let provider = await Provider.findOne({ user: req.user._id });

  const payload = {
    fullName: fullName || '',
    shopName: shopName || '',
    phone: phone || req.user.phone || '',
    profilePicture: profilePicture || '',
    categories,
    kycDocuments,
    bio: bio || '',
    skills: skills || [],
    experienceYears: experienceYears || 0,
    bankDetails: bankDetails || {},
    currentLocation: { type: 'Point', coordinates: [location.lng, location.lat] },
    locationUpdatedAt: new Date(),
    verificationStatus: 'pending_verification',
    rejectionReason: '',
  };

  if (provider) {
    Object.assign(provider, payload);
    await provider.save();
  } else {
    await User.findByIdAndUpdate(req.user._id, { role: 'provider' });
    provider = await Provider.create({ user: req.user._id, ...payload });
  }

  res.status(201).json({
    success: true,
    message: 'Registration submitted. Awaiting admin verification.',
    data: provider,
  });
});

export const getMyProviderProfile = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id })
    .populate('services')
    .populate('user', 'name email phone avatar');
  if (!provider) throw new AppError('Provider profile not found', 404);
  res.json({ success: true, data: provider });
});

export const updateProvider = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider profile not found', 404);

  const allowedFields = [
    'fullName', 'shopName', 'phone', 'profilePicture', 'categories',
    'bio', 'skills', 'experienceYears', 'bankDetails', 'availability',
    'shopAddress', 'shopPhoto',
  ];
  const update = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) update[f] = req.body[f];
  });

  // Handle KYC document updates
  if (req.body.kycDocuments && Array.isArray(req.body.kycDocuments)) {
    const kycWillChange = kycChanged(provider.kycDocuments, req.body.kycDocuments);
    update.kycDocuments = req.body.kycDocuments;
    if (kycWillChange) {
      update.verificationStatus = 'pending_verification';
      update.rejectionReason = '';
    }
  }

  // Auto-location update only
  if (req.body.location && req.body.location.lat != null && req.body.location.lng != null) {
    update.currentLocation = { type: 'Point', coordinates: [req.body.location.lng, req.body.location.lat] };
    update.locationUpdatedAt = new Date();
  }

  Object.assign(provider, update);
  await provider.save();

  res.json({ success: true, data: provider });
});

export const toggleOnline = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  provider.isOnline = !provider.isOnline;
  await provider.save();
  res.json({ success: true, data: { isOnline: provider.isOnline } });
});

export const getNearbyProviders = catchAsync(async (req, res) => {
  const { lat, lng, category } = req.query;
  if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
    throw new AppError('Customer location (lat, lng) is required.', 400);
  }

  const customerCoords = [Number(lng), Number(lat)];
  const maxDistanceMeters = 20 * 1000; // strict 20km

  const matchStage = { verificationStatus: 'verified' };
  if (category) {
    matchStage.categories = { $in: [category] };
  }

  const pipeline = [
    {
      $geoNear: {
        near: { type: 'Point', coordinates: customerCoords },
        distanceField: 'distance',
        maxDistance: maxDistanceMeters,
        spherical: true,
        query: matchStage,
      },
    },
    { $sort: { distance: 1 } },
    { $limit: 50 },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { name: 1, email: 1, phone: 1, avatar: 1 } }],
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        fullName: 1,
        shopName: 1,
        categories: 1,
        skills: 1,
        experienceYears: 1,
        rating: 1,
        reviewCount: 1,
        completedJobs: 1,
        profilePicture: 1,
        shopPhoto: 1,
        distance: { $round: [{ $divide: ['$distance', 1000] }, 1] }, // km rounded
        user: 1,
      },
    },
  ];

  const providers = await Provider.aggregate(pipeline);
  res.json({ success: true, count: providers.length, data: providers });
});

// Update live GPS location (no manual address input)
export const updateLocation = catchAsync(async (req, res) => {
  const { lat, lng } = req.body;
  if (lat == null || lng == null) {
    throw new AppError('lat and lng are required.', 400);
  }
  const provider = await Provider.findOneAndUpdate(
    { user: req.user._id },
    {
      currentLocation: { type: 'Point', coordinates: [lng, lat] },
      locationUpdatedAt: new Date(),
    },
    { new: true }
  );
  if (!provider) throw new AppError('Provider profile not found', 404);
  res.json({ success: true, data: provider.currentLocation });
});
