import Worker from '../models/Worker.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const matchJobsForWorker = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id }).populate('skills', 'name');
  if (!worker) throw new AppError('Worker profile not found', 404);

  const { lng, lat, radiusKm = 10 } = req.query;
  const skillNames = worker.skills.map((s) => (typeof s === 'string' ? s : s.name?.toLowerCase()));

  // Find pending bookings near worker
  const bookings = await Booking.find({
    status: 'pending',
    'address.lat': { $exists: true },
    'address.lng': { $exists: true },
  })
    .populate('service', 'name slug')
    .populate('customer', 'name avatar')
    .limit(100);

  // Score and rank bookings
  const scored = bookings
    .map((b) => {
      let score = 0;
      const serviceName = b.service?.name?.toLowerCase() || '';

      // Skill match
      if (skillNames.some((s) => serviceName.includes(s) || (s && serviceName.includes(s)))) score += 40;

      // Distance match (if coords provided)
      if (lng && lat && b.address.lat && b.address.lng) {
        const dLng = Math.abs(b.address.lng - Number(lng));
        const dLat = Math.abs(b.address.lat - Number(lat));
        const dist = Math.sqrt(dLng * dLng + dLat * dLat) * 111;
        if (dist <= Number(radiusKm)) score += 30;
        else if (dist <= Number(radiusKm) * 2) score += 15;
      } else {
        score += 20; // Default distance score if no coords
      }

      // Urgency (older bookings get higher score)
      const hoursOld = (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60);
      if (hoursOld > 24) score += 15;
      else if (hoursOld > 2) score += 10;

      // Price alignment
      if (worker.expectedDailyWage && b.amount >= worker.expectedDailyWage) score += 15;

      return { booking: b, score: Math.min(score, 100) };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  res.json({ success: true, matches: scored });
});

export const matchWorkersForBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate('service', 'name');
  if (!booking) throw new AppError('Booking not found', 404);

  const { lat, lng } = booking.address;
  if (!lat || !lng) throw new AppError('Booking has no location', 400);

  const serviceName = booking.service?.name?.toLowerCase() || '';

  const workers = await Worker.find({
    availableForWork: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 20000, // 20km
      },
    },
  })
    .populate('user', 'name avatar phone city')
    .populate('skills', 'name')
    .limit(50);

  const scored = workers.map((w) => {
    let score = 0;
    const skillNames = w.skills.map((s) => (typeof s === 'string' ? s : s.name?.toLowerCase()));

    if (skillNames.some((s) => serviceName.includes(s))) score += 40;
    if (w.ratingAvg >= 4) score += 25;
    else if (w.ratingAvg >= 3) score += 15;
    if (w.trustScore >= 80) score += 20;
    else if (w.trustScore >= 50) score += 10;
    if (w.experienceYears >= 5) score += 15;
    else if (w.experienceYears >= 2) score += 10;

    return { worker: w, score: Math.min(score, 100) };
  }).sort((a, b) => b.score - a.score);

  res.json({ success: true, matches: scored });
});
