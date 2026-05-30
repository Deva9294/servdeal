import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const updateMe = catchAsync(async (req, res) => {
  const allowed = ['name', 'phone', 'city', 'state', 'preferredLanguage', 'notificationsEnabled', 'avatar', 'email'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  // allow location update as an object: { location: { lat, lng } }
  if (req.body.location && typeof req.body.location === 'object') {
    const { lat, lng } = req.body.location;
    if (typeof lat === 'number' && typeof lng === 'number') {
      updates.location = { lat, lng };
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  res.json({ success: true, data: user });
});

export const getMyAddresses = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('addresses');
  res.json({ success: true, data: user.addresses });
});

export const addAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, data: user.addresses });
});

export const deleteAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.addresses.findIndex((a) => a._id.toString() === req.params.id);
  if (idx === -1) throw new AppError('Address not found', 404);
  user.addresses.splice(idx, 1);
  await user.save();
  res.json({ success: true, data: user.addresses });
});

export const setDefaultAddress = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);
  if (!address) throw new AppError('Address not found', 404);
  user.addresses.forEach((a) => (a.isDefault = false));
  address.isDefault = true;
  await user.save();
  res.json({ success: true, data: user.addresses });
});
