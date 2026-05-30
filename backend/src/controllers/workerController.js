import Worker from '../models/Worker.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const registerWorker = catchAsync(async (req, res) => {
  const existing = await Worker.findOne({ user: req.user._id });
  if (existing) throw new AppError('Worker profile already exists', 400);

  const worker = await Worker.create({
    user: req.user._id,
    ...req.body,
  });

  res.status(201).json({ success: true, worker });
});

export const getMyWorkerProfile = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id }).populate('skills', 'name category');
  if (!worker) throw new AppError('Worker profile not found', 404);
  res.json({ success: true, worker });
});

export const updateMyWorkerProfile = catchAsync(async (req, res) => {
  const worker = await Worker.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  }).populate('skills', 'name category');
  if (!worker) throw new AppError('Worker profile not found', 404);
  res.json({ success: true, worker });
});

export const toggleAvailability = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);
  worker.availableForWork = !worker.availableForWork;
  await worker.save();
  res.json({ success: true, availableForWork: worker.availableForWork });
});

export const getNearbyWorkers = catchAsync(async (req, res) => {
  const { lng, lat, radiusKm = 10 } = req.query;
  if (!lng || !lat) throw new AppError('lng and lat are required', 400);

  const workers = await Worker.find({
    availableForWork: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radiusKm) * 1000,
      },
    },
  })
    .limit(50)
    .populate('user', 'name phone avatar city')
    .populate('skills', 'name category');

  res.json({ success: true, count: workers.length, workers });
});


