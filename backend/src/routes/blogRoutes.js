import { Router } from 'express';
import * as ctrl from '../controllers/blogController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();
router.get('/', ctrl.getBlogs);
router.get('/:slug', ctrl.getBlogBySlug);
router.post('/', protect, restrictTo('admin', 'superadmin'), ctrl.createBlog);

export default router;
