import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  requestRefund,
  getMyRefunds,
  approveRefund,
  processRefund,
  getAdminRefunds,
} from '../controllers/refundController.js';

const router = Router();

router.post('/request', protect, requestRefund);
router.get('/my', protect, getMyRefunds);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAdminRefunds);
router.patch('/admin/:id/approve', protect, authorize('admin', 'superadmin'), approveRefund);
router.patch('/admin/:id/process', protect, authorize('admin', 'superadmin'), processRefund);

export default router;
