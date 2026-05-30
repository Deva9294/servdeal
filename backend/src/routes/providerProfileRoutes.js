import { Router } from 'express';
import multer from 'multer';
import * as controller from '../controllers/providerProfileController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Provider endpoints
router.use(protect);

router.post('/profile', controller.upsertProfile);
router.get('/profile/me', controller.getMyProfile);
router.patch('/availability', controller.toggleAvailability);
router.patch('/schedule', controller.updateSchedule);
router.post('/document', upload.single('document'), controller.uploadDocument);
router.patch('/bank', controller.updateBankDetails);

// Admin endpoints
router.get('/admin/all', restrictTo('admin', 'superadmin'), controller.listProviders);
router.get('/admin/:id', restrictTo('admin', 'superadmin'), controller.getProviderById);
router.patch('/admin/:id/verify', restrictTo('admin', 'superadmin'), controller.verifyProvider);
router.patch('/admin/:id/toggle', restrictTo('admin', 'superadmin'), controller.adminToggleProvider);

export default router;
