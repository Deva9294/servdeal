import { Router } from 'express';
import * as ctrl from '../controllers/trainingController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/', ctrl.getCourses);
router.get('/enrollments', protect, restrictTo('worker'), ctrl.getMyEnrollments);
router.get('/:slug', ctrl.getCourse);
router.post('/:courseId/enroll', protect, restrictTo('worker'), ctrl.enrollCourse);
router.patch('/enrollments/:id/progress', protect, restrictTo('worker'), ctrl.updateProgress);
router.post('/', protect, restrictTo('admin'), ctrl.createCourse);

export default router;
