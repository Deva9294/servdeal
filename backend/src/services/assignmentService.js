import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';
import { findRankedProviders } from './rankingService.js';

const ASSIGNMENT_TIMEOUT_MS = 2 * 60 * 1000;

/**
 * Auto-assign a booking to the best available provider
 */
export const autoAssignBooking = async (bookingId, io) => {
  const booking = await Booking.findById(bookingId).populate('service');
  if (!booking || booking.provider) return null;

  const { lat, lng } = booking.address || {};
  if (!lat || !lng) return null;

  const ranked = await findRankedProviders({
    serviceId: booking.service._id,
    customerLat: lat,
    customerLng: lng,
    radiusKm: booking.assignmentRadiusKm || 20,
    limit: 10,
  });

  if (!ranked.length) return null;

  booking.notifiedProviders = ranked.map((r) => ({
    provider: r.providerId,
    notifiedAt: new Date(),
    response: 'timeout',
  }));
  await booking.save();

  for (const rankedProvider of ranked) {
    const provider = rankedProvider.provider;
    if (!provider) continue;

    await Notification.create({
      user: provider.user._id,
      title: booking.isEmergency ? 'Emergency Booking Available' : 'New Booking Available',
      message: `${booking.service.name} at ${booking.address.city || 'your area'}. Tap to accept.`,
      type: 'booking',
      link: `/provider/bookings/accept/${booking._id}`,
    });

    io?.to(`user:${provider.user._id}`).emit('booking:offer', {
      bookingId: booking._id,
      bookingIdCode: booking.bookingId,
      service: booking.service.name,
      address: booking.address,
      amount: booking.amount,
      isEmergency: booking.isEmergency,
      expiresAt: new Date(Date.now() + ASSIGNMENT_TIMEOUT_MS),
      providerScore: rankedProvider.finalScore,
    });
  }

  setTimeout(async () => {
    await resolveAssignment(bookingId, io);
  }, ASSIGNMENT_TIMEOUT_MS);

  return ranked;
};

/**
 * Resolve assignment after timeout - assign to first acceptor or best available
 */
export const resolveAssignment = async (bookingId, io) => {
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.provider) return;

  const accepted = booking.notifiedProviders.find((n) => n.response === 'accepted');
  if (accepted) {
    booking.provider = accepted.provider;
    booking.status = 'confirmed';
    booking.isAutoAssigned = true;
    booking.autoAssignedAt = new Date();
    booking.timeline.push({ status: 'confirmed', note: 'Auto-assigned via ranking engine' });
    await booking.save();

    const provider = await Provider.findById(accepted.provider);
    if (provider) {
      provider.totalJobRequests = (provider.totalJobRequests || 0) + 1;
      provider.acceptedJobs = (provider.acceptedJobs || 0) + 1;
      await provider.save();
    }

    await Notification.create({
      user: booking.customer,
      title: 'Provider Assigned',
      message: `A provider has been assigned to your booking ${booking.bookingId}`,
      type: 'booking',
    });

    io?.to(`user:${booking.customer}`).emit('booking:assigned', {
      bookingId: booking._id,
      providerId: accepted.provider,
    });

    for (const n of booking.notifiedProviders) {
      if (n.provider.toString() !== accepted.provider.toString() && n.response !== 'accepted') {
        io?.to(`user:${n.provider}`).emit('booking:cancelled', {
          bookingId: booking._id,
          reason: 'Another provider accepted',
        });
      }
    }
  }
};

/**
 * Provider accepts a booking offer
 */
export const acceptBookingOffer = async (bookingId, providerId, io) => {
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.provider) return { success: false, message: 'Booking no longer available' };

  const notified = booking.notifiedProviders.find(
    (n) => n.provider.toString() === providerId.toString()
  );
  if (!notified) return { success: false, message: 'You were not offered this booking' };

  notified.response = 'accepted';
  notified.respondedAt = new Date();
  booking.provider = providerId;
  booking.status = 'confirmed';
  booking.isAutoAssigned = true;
  booking.autoAssignedAt = new Date();
  booking.timeline.push({ status: 'confirmed', note: 'Provider accepted booking' });
  await booking.save();

  const provider = await Provider.findById(providerId);
  if (provider) {
    provider.totalJobRequests = (provider.totalJobRequests || 0) + 1;
    provider.acceptedJobs = (provider.acceptedJobs || 0) + 1;
    await provider.save();
  }

  await Notification.create({
    user: booking.customer,
    title: 'Provider Assigned',
    message: `Your booking ${booking.bookingId} has been accepted by a provider`,
    type: 'booking',
  });

  io?.to(`user:${booking.customer}`).emit('booking:assigned', {
    bookingId: booking._id,
    providerId,
  });

  for (const n of booking.notifiedProviders) {
    if (n.provider.toString() !== providerId.toString()) {
      io?.to(`user:${n.provider}`).emit('booking:cancelled', {
        bookingId: booking._id,
        reason: 'Another provider accepted',
      });
    }
  }

  return { success: true, data: booking };
};

/**
 * Provider rejects a booking offer
 */
export const rejectBookingOffer = async (bookingId, providerId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) return { success: false };

  const notified = booking.notifiedProviders.find(
    (n) => n.provider.toString() === providerId.toString()
  );
  if (notified) {
    notified.response = 'rejected';
    notified.respondedAt = new Date();
    await booking.save();
  }

  const provider = await Provider.findById(providerId);
  if (provider) {
    provider.totalJobRequests = (provider.totalJobRequests || 0) + 1;
    await provider.save();
  }

  return { success: true };
};
