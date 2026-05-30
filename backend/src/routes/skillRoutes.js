import { Router } from 'express';
import * as ctrl from '../controllers/skillController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.listSkills);
router.post('/', protect, restrictTo('admin', 'superadmin'), ctrl.createSkill);

export default router;


