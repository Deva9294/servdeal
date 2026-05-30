import { Router } from 'express';
import * as ctrl from '../controllers/jobPostController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.listJobPosts);
router.post('/', protect, restrictTo('employer'), ctrl.createJobPost);
router.get('/mine', protect, restrictTo('employer'), ctrl.getMyPostedJobs);
router.post('/:id/apply', protect, restrictTo('worker'), ctrl.applyToJob);

export default router;


