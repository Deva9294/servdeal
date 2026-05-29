import { Router } from 'express';
import * as ctrl from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/', ctrl.createBooking);
router.get('/my', ctrl.getMyBookings);
router.get('/provider', restrictTo('provider'), ctrl.getProviderBookings);
router.patch('/location', restrictTo('provider'), ctrl.updateProviderLocation);
router.get('/:id', ctrl.getBooking);
router.patch('/:id/status', ctrl.updateBookingStatus);
router.patch('/:id/assign', restrictTo('admin', 'superadmin'), ctrl.assignProvider);

export default router;
