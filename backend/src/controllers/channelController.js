import Channel from '../models/ChannelModel.js';
import User from '../models/UserModel.js';

// Create channel
export const createChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Channel name is required',
      });
    }

    // Check if channel already exists
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(409).json({
        success: false,
        message: 'Channel name already exists',
      });
    }

    const channel = await Channel.create({
      name,
      description,
      category,
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Channel created successfully',
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create channel',
      error: error.message,
    });
  }
};

// Get user channels
export const getUserChannels = async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.userId });

    res.status(200).json({
      success: true,
      channels,
      count: channels.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get channels',
      error: error.message,
    });
  }
};

// Get channel details
export const getChannelDetails = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId).populate('owner', 'name email avatar');

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get channel details',
      error: error.message,
    });
  }
};

// Update channel
export const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, description, logo, banner, category, aiSettings } = req.body;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    // Verify ownership
    if (channel.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this channel',
      });
    }

    // Update fields
    if (name) channel.name = name;
    if (description) channel.description = description;
    if (logo) channel.logo = logo;
    if (banner) channel.banner = banner;
    if (category) channel.category = category;
    if (aiSettings) channel.aiSettings = { ...channel.aiSettings, ...aiSettings };

    await channel.save();

    res.status(200).json({
      success: true,
      message: 'Channel updated successfully',
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update channel',
      error: error.message,
    });
  }
};

// Subscribe to channel
export const subscribeToChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    channel.subscribers += 1;
    await channel.save();

    res.status(200).json({
      success: true,
      message: 'Subscribed to channel',
      channel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
      error: error.message,
    });
  }
};

// Delete channel
export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found',
      });
    }

    // Verify ownership
    if (channel.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this channel',
      });
    }

    await Channel.findByIdAndDelete(channelId);

    res.status(200).json({
      success: true,
      message: 'Channel deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete channel',
      error: error.message,
    });
  }
};

export default {
  createChannel,
  getUserChannels,
  getChannelDetails,
  updateChannel,
  subscribeToChannel,
  deleteChannel,
};
