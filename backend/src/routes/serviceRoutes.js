import { Router } from 'express';
import * as ctrl from '../controllers/serviceController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/categories', ctrl.getCategories);
router.get('/', ctrl.getServices);
router.get('/:slug', ctrl.getServiceBySlug);
router.post('/', protect, restrictTo('admin', 'superadmin'), ctrl.createService);
router.patch('/:id', protect, restrictTo('admin', 'superadmin'), ctrl.updateService);

export default router;
