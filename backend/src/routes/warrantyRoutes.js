import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  createWarranty,
  getMyWarranties,
  getWarranty,
  submitClaim,
  updateClaimStatus,
  getAdminWarranties,
} from '../controllers/warrantyController.js';

const router = Router();

router.post('/', protect, createWarranty);
router.get('/my', protect, getMyWarranties);
router.get('/:id', protect, getWarranty);
router.post('/:id/claim', protect, submitClaim);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), getAdminWarranties);
router.patch('/admin/:id/claim', protect, authorize('admin', 'superadmin'), updateClaimStatus);

export default router;
