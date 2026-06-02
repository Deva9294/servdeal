import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  getMyCashback,
  getCashbackStats,
  getAdminCashbackAnalytics,
} from '../controllers/cashbackController.js';

const router = Router();

router.get('/my', protect, getMyCashback);
router.get('/stats', protect, getCashbackStats);
router.get('/admin/analytics', protect, authorize('admin', 'superadmin'), getAdminCashbackAnalytics);

export default router;
