import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, data: notifications });
});

export const markRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, _id: { $in: req.body.ids || [] } },
    { isRead: true }
  );
  res.json({ success: true });
});
