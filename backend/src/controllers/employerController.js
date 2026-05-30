import Employer from '../models/Employer.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const registerEmployer = catchAsync(async (req, res) => {
  const existing = await Employer.findOne({ user: req.user._id });
  if (existing) throw new AppError('Employer profile already exists', 400);

  const employer = await Employer.create({
    user: req.user._id,
    ...req.body,
  });

  res.status(201).json({ success: true, employer });
});

export const getMyEmployerProfile = catchAsync(async (req, res) => {
  const employer = await Employer.findOne({ user: req.user._id });
  if (!employer) throw new AppError('Employer profile not found', 404);
  res.json({ success: true, employer });
});

export const updateMyEmployerProfile = catchAsync(async (req, res) => {
  const employer = await Employer.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employer) throw new AppError('Employer profile not found', 404);
  res.json({ success: true, employer });
});


