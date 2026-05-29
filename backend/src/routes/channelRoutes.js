import express from 'express';
import {
  createChannel,
  getUserChannels,
  getChannelDetails,
  updateChannel,
  subscribeToChannel,
  deleteChannel,
} from '../controllers/channelController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create channel (requires auth)
router.post('/', protect, createChannel);

// Get user's channels (requires auth)
router.get('/my-channels', protect, getUserChannels);

// Get channel details (optional auth)
router.get('/:channelId', optionalAuth, getChannelDetails);

// Update channel (requires auth and ownership)
router.put('/:channelId', protect, updateChannel);

// Subscribe to channel (requires auth)
router.post('/:channelId/subscribe', protect, subscribeToChannel);

// Delete channel (requires auth and ownership)
router.delete('/:channelId', protect, deleteChannel);

export default router;
