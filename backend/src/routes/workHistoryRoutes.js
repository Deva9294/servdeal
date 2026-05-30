import { Router } from 'express';
import * as ctrl from '../controllers/workHistoryController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, restrictTo('worker'), ctrl.createEntry);
router.get('/me', protect, restrictTo('worker'), ctrl.getMyHistory);
router.patch('/:id', protect, restrictTo('worker'), ctrl.updateEntry);
router.delete('/:id', protect, restrictTo('worker'), ctrl.deleteEntry);
router.get('/portfolio/:workerId', ctrl.getPortfolio);

export default router;
