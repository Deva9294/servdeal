import { Router } from 'express';
import * as ctrl from '../controllers/toolController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, ctrl.createTool);
router.get('/', ctrl.getTools);
router.get('/me', protect, ctrl.getMyTools);
router.get('/rentals', protect, ctrl.getMyRentals);
router.get('/:slug', ctrl.getTool);
router.patch('/:id', protect, ctrl.updateTool);
router.delete('/:id', protect, ctrl.deleteTool);
router.post('/:id/rent', protect, ctrl.rentTool);
router.patch('/rentals/:id/status', protect, ctrl.updateRentalStatus);

export default router;
