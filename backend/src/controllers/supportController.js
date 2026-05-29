import SupportTicket from '../models/SupportTicket.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createTicket = catchAsync(async (req, res) => {
  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject: req.body.subject,
    message: req.body.message,
    category: req.body.category || 'general',
  });
  res.status(201).json({ success: true, data: ticket });
});

export const getMyTickets = catchAsync(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: tickets });
});

export const getAllTickets = catchAsync(async (req, res) => {
  const tickets = await SupportTicket.find()
    .populate('user', 'name email phone')
    .sort('-createdAt');
  res.json({ success: true, data: tickets });
});

export const updateTicket = catchAsync(async (req, res) => {
  const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: ticket });
});
