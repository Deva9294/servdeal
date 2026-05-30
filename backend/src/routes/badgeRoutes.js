import { Router } from 'express';
import * as ctrl from '../controllers/badgeController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.getBadges);
router.get('/me', protect, restrictTo('worker'), ctrl.getMyBadges);
router.get('/:slug', ctrl.getBadge);
router.post('/', protect, restrictTo('admin'), ctrl.createBadge);
router.post('/award', protect, restrictTo('admin'), ctrl.awardBadge);
router.post('/revoke', protect, restrictTo('admin'), ctrl.revokeBadge);

export default router;
