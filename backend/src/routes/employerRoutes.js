import { Router } from 'express';
import * as ctrl from '../controllers/employerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.post('/register', protect, restrictTo('employer'), ctrl.registerEmployer);
router.get('/me', protect, restrictTo('employer'), ctrl.getMyEmployerProfile);
router.patch('/me', protect, restrictTo('employer'), ctrl.updateMyEmployerProfile);

export default router;


