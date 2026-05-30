import { Router } from 'express';
import * as ctrl from '../controllers/workerCardController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, restrictTo('worker'), ctrl.createCard);
router.get('/me', protect, restrictTo('worker'), ctrl.getMyCard);
router.patch('/me', protect, restrictTo('worker'), ctrl.updateCard);
router.patch('/me/deactivate', protect, restrictTo('worker'), ctrl.deactivateCard);
router.get('/:cardId', ctrl.getCardById);
router.patch('/:id/verify', protect, restrictTo('admin'), ctrl.verifyCard);

export default router;
