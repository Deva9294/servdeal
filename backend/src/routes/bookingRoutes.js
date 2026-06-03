import { Router } from 'express';
import * as ctrl from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', ctrl.createBooking);
router.get('/my', ctrl.getMyBookings);
router.get('/provider', restrictTo('provider'), ctrl.getProviderBookings);
router.get('/:id', ctrl.getBooking);

// Provider actions
router.post('/:id/accept', restrictTo('provider'), ctrl.acceptBooking);
router.post('/:id/reject', restrictTo('provider'), ctrl.rejectBooking);
router.post('/:id/start', restrictTo('provider'), ctrl.startJob);
router.post('/:id/complete', restrictTo('provider'), ctrl.completeJob);

export default router;
