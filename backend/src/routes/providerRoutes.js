import { Router } from 'express';
import * as ctrl from '../controllers/providerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/nearby', ctrl.getNearbyProviders);
router.post('/register', protect, ctrl.registerProvider);
router.get('/me', protect, restrictTo('provider'), ctrl.getMyProviderProfile);
router.patch('/me', protect, restrictTo('provider'), ctrl.updateProvider);
router.patch('/online', protect, restrictTo('provider'), ctrl.toggleOnline);

export default router;
