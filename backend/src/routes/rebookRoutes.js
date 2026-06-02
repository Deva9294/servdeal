import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { rebookService, getRebookableBookings } from '../controllers/rebookController.js';

const router = Router();

router.get('/bookings', protect, getRebookableBookings);
router.post('/:bookingId', protect, rebookService);

export default router;
