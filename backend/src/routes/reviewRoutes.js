import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', ctrl.getReviews);
router.post('/', protect, ctrl.createReview);

export default router;
