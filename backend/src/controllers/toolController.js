import Tool from '../models/Tool.js';
import ToolRental from '../models/ToolRental.js';
import Notification from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createTool = catchAsync(async (req, res) => {
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  const tool = await Tool.create({ ...req.body, owner: req.user._id, slug });
  res.status(201).json({ success: true, tool });
});

export const getTools = catchAsync(async (req, res) => {
  const { category, city, page = 1, limit = 20 } = req.query;
  const filter = { isAvailable: true };
  if (category) filter.category = category;
  if (city) filter['location.city'] = new RegExp(city, 'i');

  const tools = await Tool.find(filter)
    .populate('owner', 'name avatar city')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Tool.countDocuments(filter);

  res.json({ success: true, tools, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getTool = catchAsync(async (req, res) => {
  const tool = await Tool.findOne({ slug: req.params.slug }).populate('owner', 'name avatar city rating');
  if (!tool) throw new AppError('Tool not found', 404);
  res.json({ success: true, tool });
});

export const getMyTools = catchAsync(async (req, res) => {
  const tools = await Tool.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, tools });
});

export const updateTool = catchAsync(async (req, res) => {
  const tool = await Tool.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );
  if (!tool) throw new AppError('Tool not found', 404);
  res.json({ success: true, tool });
});

export const deleteTool = catchAsync(async (req, res) => {
  const tool = await Tool.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!tool) throw new AppError('Tool not found', 404);
  res.json({ success: true, message: 'Deleted' });
});

export const rentTool = catchAsync(async (req, res) => {
  const tool = await Tool.findById(req.params.id);
  if (!tool || !tool.isAvailable) throw new AppError('Tool not available', 400);

  const { startDate, endDate, deliveryMethod, deliveryAddress } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (days < tool.minRentalDays) throw new AppError(`Minimum rental is ${tool.minRentalDays} days`, 400);

  const totalAmount = days * tool.pricePerDay;

  const rental = await ToolRental.create({
    tool: tool._id,
    renter: req.user._id,
    owner: tool.owner,
    startDate: start,
    endDate: end,
    totalDays: days,
    dailyRate: tool.pricePerDay,
    totalAmount,
    deposit: tool.deposit,
    deliveryMethod,
    deliveryAddress,
  });

  const io = req.app.get('io');
  await Notification.create({
    user: tool.owner,
    title: 'New Tool Rental Request',
    message: `Someone requested to rent your ${tool.name}`,
    type: 'tool',
    link: '/provider/bookings',
  });
  io?.to(`user:${tool.owner}`).emit('notification', {
    title: 'New Tool Rental Request',
    message: `Someone requested to rent your ${tool.name}`,
  });

  res.status(201).json({ success: true, rental });
});

export const getMyRentals = catchAsync(async (req, res) => {
  const asRenter = await ToolRental.find({ renter: req.user._id })
    .populate('tool', 'name images slug pricePerDay')
    .sort({ createdAt: -1 });

  const asOwner = await ToolRental.find({ owner: req.user._id })
    .populate('tool', 'name images slug')
    .populate('renter', 'name phone')
    .sort({ createdAt: -1 });

  res.json({ success: true, asRenter, asOwner });
});

export const updateRentalStatus = catchAsync(async (req, res) => {
  const rental = await ToolRental.findOne({ _id: req.params.id, owner: req.user._id });
  if (!rental) throw new AppError('Rental not found', 404);

  rental.status = req.body.status;
  if (req.body.status === 'returned') rental.returnedAt = new Date();
  await rental.save();

  const io = req.app.get('io');
  await Notification.create({
    user: rental.renter,
    title: 'Rental Update',
    message: `Your tool rental is now ${req.body.status}`,
    type: 'tool',
    link: '/dashboard/bookings',
  });
  io?.to(`user:${rental.renter}`).emit('notification', {
    title: 'Rental Update',
    message: `Your tool rental is now ${req.body.status}`,
  });

  res.json({ success: true, rental });
});
