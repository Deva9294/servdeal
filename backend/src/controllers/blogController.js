import Blog from '../models/Blog.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getBlogs = catchAsync(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true }).sort('-createdAt');
  res.json({ success: true, data: blogs });
});

export const getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
  if (!blog) throw new AppError('Blog not found', 404);
  res.json({ success: true, data: blog });
});

export const createBlog = catchAsync(async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: blog });
});
