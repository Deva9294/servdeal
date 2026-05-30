import { Router } from 'express';
import * as ctrl from '../controllers/teamController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, restrictTo('worker'), ctrl.createTeam);
router.get('/me', protect, restrictTo('worker'), ctrl.getMyTeam);
router.get('/', ctrl.getTeams);
router.patch('/:id', protect, restrictTo('worker'), ctrl.updateTeam);
router.post('/members', protect, restrictTo('worker'), ctrl.addMember);
router.delete('/members', protect, restrictTo('worker'), ctrl.removeMember);

export default router;
