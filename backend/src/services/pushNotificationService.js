import User from '../models/User.js';
import Notification from '../models/Notification.js';

/**
 * Send push notification via FCM (Firebase Cloud Messaging)
 * Falls back to in-app notification if FCM token not available
 */
export const sendPushNotification = async ({
  userId,
  title,
  body,
  data = {},
  type = 'general',
}) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message: body,
    type,
    link: data.link || null,
  });

  const user = await User.findById(userId).select('fcmToken notificationsEnabled');
  if (!user || !user.notificationsEnabled) return { sent: false, reason: 'notifications_disabled' };

  if (!user.fcmToken) return { sent: false, reason: 'no_fcm_token', notification };

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${process.env.FCM_SERVER_KEY}`,
      },
      body: JSON.stringify({
        to: user.fcmToken,
        notification: { title, body, sound: 'default' },
        data: { ...data, type, notificationId: String(notification._id) },
        priority: 'high',
      }),
    });

    if (!response.ok) throw new Error(`FCM error: ${response.status}`);
    return { sent: true, notification };
  } catch (err) {
    return { sent: false, reason: err.message, notification };
  }
};

/**
 * Broadcast to multiple users
 */
export const broadcastPushNotification = async ({
  userIds,
  title,
  body,
  data = {},
  type = 'general',
}) => {
  const results = [];
  for (const userId of userIds) {
    const result = await sendPushNotification({ userId, title, body, data, type });
    results.push({ userId, ...result });
  }
  return results;
};

/**
 * Notify provider about new booking
 */
export const notifyProviderBooking = async (providerId, booking, io) => {
  const provider = await User.findOne({ _id: providerId }).select('fcmToken');
  if (!provider) return;

  const result = await sendPushNotification({
    userId: provider._id,
    title: 'New Booking Request',
    body: `A customer needs ${booking.service?.name || 'a service'} at ${booking.address?.city || 'your area'}`,
    type: 'booking',
    data: { bookingId: String(booking._id), link: `/provider/bookings/${booking._id}` },
  });

  io?.to(`user:${provider._id}`).emit('notification', {
    title: 'New Booking Request',
    message: `New ${booking.service?.name || 'service'} booking available`,
    type: 'booking',
    data: { bookingId: String(booking._id) },
  });

  return result;
};

/**
 * Notify customer about booking updates
 */
export const notifyCustomerBooking = async (customerId, title, body, booking, io) => {
  const result = await sendPushNotification({
    userId: customerId,
    title,
    body,
    type: 'booking',
    data: { bookingId: String(booking._id), link: `/dashboard/bookings/${booking._id}` },
  });

  io?.to(`user:${customerId}`).emit('notification', {
    title,
    message: body,
    type: 'booking',
    data: { bookingId: String(booking._id) },
  });

  return result;
};
