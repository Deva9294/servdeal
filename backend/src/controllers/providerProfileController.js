import ProviderProfile from '../models/ProviderProfile.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

// Create or update provider profile
export const upsertProfile = catchAsync(async (req, res) => {
  const userId = req.user._id;
  let profile = await ProviderProfile.findOne({ user: userId });

  const updateData = {
    ...req.body,
    user: userId,
    kycStatus: 'submitted',
    overallStatus: 'pending_approval',
  };

  if (profile) {
    profile = await ProviderProfile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  } else {
    profile = await ProviderProfile.create(updateData);
  }

  // Update user role if not already provider
  const user = await User.findById(userId);
  if (user.role === 'customer') {
    user.role = 'provider';
    await user.save();
  }

  res.json({ success: true, message: 'Profile saved for review', profile });
});

// Get my provider profile
export const getMyProfile = catchAsync(async (req, res) => {
  const profile = await ProviderProfile.findOne({ user: req.user._id })
    .populate('skills.category', 'name slug')
    .populate('primaryCategory', 'name slug');

  if (!profile) throw new AppError('Provider profile not found', 404);
  res.json({ success: true, profile });
});

// Toggle availability
export const toggleAvailability = catchAsync(async (req, res) => {
  const { isAvailable } = req.body;
  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { isAvailable: Boolean(isAvailable) } },
    { new: true }
  );
  if (!profile) throw new AppError('Provider profile not found', 404);

  res.json({
    success: true,
    message: `You are now ${isAvailable ? 'available' : 'offline'}`,
    isAvailable: profile.isAvailable,
  });
});

// Update work schedule
export const updateSchedule = catchAsync(async (req, res) => {
  const { schedule } = req.body;
  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { schedule } },
    { new: true }
  );
  if (!profile) throw new AppError('Provider profile not found', 404);
  res.json({ success: true, schedule: profile.schedule });
});

// Upload KYC document
export const uploadDocument = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  const { docType } = req.body;
  const allowedTypes = ['aadhaar', 'pan', 'driving_license', 'certificate', 'skill_proof'];
  if (!allowedTypes.includes(docType)) throw new AppError('Invalid document type', 400);

  const result = await uploadToCloudinary(req.file.buffer, `providers/${req.user._id}/${docType}`);

  const profile = await ProviderProfile.findOne({ user: req.user._id });
  if (!profile) throw new AppError('Provider profile not found', 404);

  // Update specific doc field
  if (docType === 'aadhaar') {
    profile.aadhaarDoc = { url: result.secure_url, publicId: result.public_id, type: docType };
  } else if (docType === 'pan') {
    profile.panDoc = { url: result.secure_url, publicId: result.public_id, type: docType };
  } else {
    profile.skills.forEach((skill) => {
      skill.certificates.push({ url: result.secure_url, publicId: result.public_id, type: docType });
    });
  }

  await profile.save();
  res.json({ success: true, message: 'Document uploaded', url: result.secure_url });
});

// Update bank details
export const updateBankDetails = catchAsync(async (req, res) => {
  const profile = await ProviderProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { bankDetails: { ...req.body, verified: false }, bankStatus: 'submitted' } },
    { new: true }
  );
  if (!profile) throw new AppError('Provider profile not found', 404);
  res.json({ success: true, message: 'Bank details updated', bankDetails: profile.bankDetails });
});

// ========================================
// Admin Endpoints
// ========================================

// List all provider profiles (admin)
export const listProviders = catchAsync(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.overallStatus = status;
  if (search) {
    filter.$or = [
      { 'user.name': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
      { 'user.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const profiles = await ProviderProfile.find(filter)
    .populate('user', 'name email phone avatar')
    .sort({ createdAt: -1 })
    .skip((+page - 1) * +limit)
    .limit(+limit);

  const total = await ProviderProfile.countDocuments(filter);

  res.json({ success: true, profiles, pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) } });
});

// Get single provider (admin)
export const getProviderById = catchAsync(async (req, res) => {
  const profile = await ProviderProfile.findById(req.params.id)
    .populate('user', 'name email phone avatar city state')
    .populate('skills.category', 'name slug')
    .populate('primaryCategory', 'name slug');
  if (!profile) throw new AppError('Provider not found', 404);
  res.json({ success: true, profile });
});

// Verify/reject provider (admin)
export const verifyProvider = catchAsync(async (req, res) => {
  const { status, rejectionReason, adminNotes } = req.body;
  const validStatuses = ['incomplete', 'pending_approval', 'approved', 'rejected', 'suspended'];
  if (!validStatuses.includes(status)) throw new AppError('Invalid status', 400);

  const profile = await ProviderProfile.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        overallStatus: status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
        adminNotes,
        ...(status === 'approved' && {
          kycStatus: 'verified',
          bankStatus: 'verified',
        }),
      },
    },
    { new: true }
  );

  if (!profile) throw new AppError('Provider not found', 404);
  res.json({ success: true, message: `Provider ${status}`, profile });
});

// Toggle provider availability (admin)
export const adminToggleProvider = catchAsync(async (req, res) => {
  const { isAvailable } = req.body;
  const profile = await ProviderProfile.findByIdAndUpdate(
    req.params.id,
    { $set: { isAvailable: Boolean(isAvailable) } },
    { new: true }
  );
  if (!profile) throw new AppError('Provider not found', 404);
  res.json({ success: true, message: `Provider ${isAvailable ? 'enabled' : 'disabled'}`, profile });
});
