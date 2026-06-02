import Service from '../models/Service.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { smartSearch } from '../services/aiService.js';

export const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder');
  res.json({ success: true, data: categories });
});

export const getServices = catchAsync(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  let services = await Service.find(filter).populate('category').sort('name');
  if (req.query.q) services = smartSearch(req.query.q, services);
  res.json({ success: true, data: services });
});

export const getServicesByCategory = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder').lean();
  const services = await Service.find({ isActive: true }).populate('category').lean();

  const grouped = categories.map((cat) => ({
    ...cat,
    services: services.filter((s) => s.category?._id?.toString() === cat._id.toString()).map((s) => ({
      _id: s._id,
      name: s.name,
      slug: s.slug,
      icon: s.icon,
      color: s.color || 'bg-orange-100 text-brand-orange',
      basePrice: s.basePrice,
      description: s.shortDescription || s.description || '',
    })),
  })).filter((cat) => cat.services.length > 0);

  res.json({ success: true, data: grouped });
});

export const getServiceBySlug = catchAsync(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true })
    .populate('category')
    .populate('relatedServices');
  if (!service) throw new AppError('Service not found', 404);
  const reviews = await Review.find({ service: service._id, isVisible: true })
    .populate('customer', 'name avatar')
    .limit(10)
    .sort('-createdAt');
  res.json({ success: true, data: service, reviews });
});

export const createService = catchAsync(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

export const updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: service });
});
