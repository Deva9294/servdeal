import { Router } from 'express';
import * as ctrl from '../controllers/supportController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, ctrl.createTicket);
router.get('/my', protect, ctrl.getMyTickets);
router.get('/', protect, restrictTo('admin', 'superadmin'), ctrl.getAllTickets);
router.patch('/:id', protect, restrictTo('admin', 'superadmin'), ctrl.updateTicket);

export default router;
