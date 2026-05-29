import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/generateToken.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) return next(new AppError('Please log in', 401));

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('User no longer exists', 401));
  if (user.isBlocked) return next(new AppError('Account blocked', 403));

  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized', 403));
    }
    next();
  };
