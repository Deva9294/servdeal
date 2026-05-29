import { Router } from 'express';
import * as ctrl from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.patch('/me', ctrl.updateMe);
router.post('/addresses', ctrl.addAddress);

export default router;
