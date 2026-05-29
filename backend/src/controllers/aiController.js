import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { catchAsync } from '../utils/catchAsync.js';
import {
  chatbotReply,
  getRecommendations,
  smartSearch,
  suggestPricing,
} from '../services/aiService.js';

export const chatbot = catchAsync(async (req, res) => {
  res.json({ success: true, reply: chatbotReply(req.body.message || '') });
});

export const recommendations = catchAsync(async (req, res) => {
  const services = await Service.find({ isActive: true }).populate('category');
  const bookings = await Booking.find({ customer: req.user._id })
    .populate('service')
    .limit(5);
  res.json({ success: true, data: getRecommendations(bookings, services) });
});

export const search = catchAsync(async (req, res) => {
  const services = await Service.find({ isActive: true });
  res.json({ success: true, data: smartSearch(req.query.q || '', services) });
});

export const pricing = catchAsync(async (req, res) => {
  const service = await Service.findById(req.params.serviceId);
  res.json({
    success: true,
    data: suggestPricing(service?.basePrice || 499, Number(req.query.demand) || 1),
  });
});
