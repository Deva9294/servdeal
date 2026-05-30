import JobAlert from '../models/JobAlert.js';
import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getMyAlerts = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const alerts = await JobAlert.find({ worker: worker._id })
    .populate({
      path: 'booking',
      select: 'bookingId service amount address status scheduledAt',
      populate: { path: 'service', select: 'name' },
    })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, alerts });
});

export const respondToAlert = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const alert = await JobAlert.findOne({ _id: req.params.id, worker: worker._id });
  if (!alert) throw new AppError('Alert not found', 404);
  if (alert.status !== 'pending') throw new AppError('Alert already responded', 400);
  if (alert.expiresAt < new Date()) throw new AppError('Alert expired', 400);

  const { action } = req.body; // 'accept' or 'decline'
  alert.status = action === 'accept' ? 'accepted' : 'declined';
  alert.respondedAt = new Date();
  await alert.save();

  if (action === 'accept') {
    // Link worker to booking
    await Booking.findByIdAndUpdate(alert.booking, { provider: req.user._id, status: 'confirmed' });
    const booking = await Booking.findById(alert.booking);
    if (booking) {
      const io = req.app.get('io');
      await Notification.create({
        user: booking.customer,
        title: 'Job Accepted',
        message: 'A worker has accepted your job request',
        type: 'job_alert',
        link: `/dashboard/bookings/${booking._id}`,
      });
      io?.to(`user:${booking.customer}`).emit('notification', {
        title: 'Job Accepted',
        message: 'A worker has accepted your job request',
      });
    }
  }

  res.json({ success: true, alert });
});

export const createJobAlert = catchAsync(async (req, res) => {
  const { workerId, bookingId, distanceKm, matchScore } = req.body;
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min expiry

  const alert = await JobAlert.create({
    worker: workerId,
    booking: bookingId,
    distanceKm,
    matchScore,
    expiresAt,
  });

  res.status(201).json({ success: true, alert });
});

export const generateNearbyAlerts = catchAsync(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate('service');
  if (!booking) throw new AppError('Booking not found', 404);

  const { lat, lng } = booking.address;
  if (!lat || !lng) throw new AppError('Booking has no location', 400);

  // Find nearby available workers
  const workers = await Worker.find({
    availableForWork: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 15000, // 15km
      },
    },
  }).limit(10);

  const alerts = [];
  const io = req.app.get('io');
  for (const worker of workers) {
    const distanceKm = Math.round(worker.workingRadiusKm || 5);
    const alert = await JobAlert.create({
      worker: worker._id,
      booking: bookingId,
      distanceKm,
      matchScore: Math.floor(Math.random() * 30) + 70, // Simulated AI score
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    alerts.push(alert);

    const wUser = await Worker.findById(worker._id).select('user');
    if (wUser) {
      await Notification.create({
        user: wUser.user,
        title: 'New Job Alert Nearby',
        message: `A ${booking.service?.name || 'job'} is available ${distanceKm}km away`,
        type: 'job_alert',
        link: '/provider/alerts',
      });
      io?.to(`user:${wUser.user}`).emit('notification', {
        title: 'New Job Alert',
        message: `A job is available ${distanceKm}km from you`,
      });
    }
  }

  res.json({ success: true, count: alerts.length, alerts });
});
