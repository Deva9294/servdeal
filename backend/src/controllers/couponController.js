import Coupon from '../models/Coupon.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getCoupons = catchAsync(async (req, res) => {
  const coupons = await Coupon.find({
    isActive: true,
    validUntil: { $gte: new Date() },
  });
  res.json({ success: true, data: coupons });
});

export const validateCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findOne({
    code: req.body.code.toUpperCase(),
    isActive: true,
  });
  if (!coupon) throw new AppError('Invalid coupon', 400);
  if (coupon.validUntil && coupon.validUntil < new Date()) {
    throw new AppError('Coupon expired', 400);
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400);
  }
  res.json({ success: true, data: coupon });
});
