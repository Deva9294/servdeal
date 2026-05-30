import { Router } from 'express';
import multer from 'multer';
import * as ctrl from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
router.use(protect);
router.patch('/me', ctrl.updateMe);
router.post('/avatar', upload.single('avatar'), ctrl.uploadAvatar);
router.get('/addresses', ctrl.getMyAddresses);
router.post('/addresses', ctrl.addAddress);
router.delete('/addresses/:id', ctrl.deleteAddress);
router.patch('/addresses/:id/default', ctrl.setDefaultAddress);

export default router;
