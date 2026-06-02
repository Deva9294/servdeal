import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCityLeaderboard,
  getCategoryLeaderboard,
  getTopProviders,
  getProviderRank,
} from '../controllers/leaderboardController.js';

const router = Router();

router.get('/city', getCityLeaderboard);
router.get('/category', getCategoryLeaderboard);
router.get('/top', getTopProviders);
router.get('/my-rank', protect, getProviderRank);

export default router;
