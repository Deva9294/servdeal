import { Router } from 'express';
import * as ctrl from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.patch('/me', ctrl.updateMe);
router.get('/addresses', ctrl.getMyAddresses);
router.post('/addresses', ctrl.addAddress);
router.delete('/addresses/:id', ctrl.deleteAddress);
router.patch('/addresses/:id/default', ctrl.setDefaultAddress);

export default router;
