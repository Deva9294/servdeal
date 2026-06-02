import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getBookingInvoice,
  getProviderBookingInvoice,
  downloadInvoice,
  emailInvoice,
} from '../controllers/invoiceController.js';

const router = Router();

router.get('/booking/:bookingId', protect, getBookingInvoice);
router.get('/provider/booking/:bookingId', protect, getProviderBookingInvoice);
router.get('/booking/:bookingId/download', protect, downloadInvoice);
router.post('/booking/:bookingId/email', protect, emailInvoice);

export default router;
