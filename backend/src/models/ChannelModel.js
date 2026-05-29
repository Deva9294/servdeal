import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Channel name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Channel Branding
    logo: {
      type: String,
      default: 'https://via.placeholder.com/200',
    },
    banner: {
      type: String,
      default: 'https://via.placeholder.com/1280x720',
    },
    
    // Channel Statistics
    subscribers: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalVideos: {
      type: Number,
      default: 0,
    },
    
    // Channel Settings
    isVerified: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
    },
    customURL: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      enum: ['Education', 'Entertainment', 'Gaming', 'Music', 'News', 'Sports', 'Tech', 'Other'],
      default: 'Other',
    },
    
    // AI Configuration
    aiSettings: {
      defaultVoiceType: {
        type: String,
        enum: ['male', 'female', 'neutral'],
        default: 'male',
      },
      defaultLanguage: {
        type: String,
        default: 'en',
      },
      defaultStyle: {
        type: String,
        enum: ['educational', 'entertainment', 'news', 'tutorial', 'storytelling'],
        default: 'entertainment',
      },
    },
    
    // Monetization
    isMonetized: {
      type: Boolean,
      default: false,
    },
    monetizationDetails: {
      bankAccount: String,
      taxId: String,
      payoutEmail: String,
    },
    
    // Connected Accounts
    connectedAccounts: {
      youtube: {
        connected: { type: Boolean, default: false },
        channelId: String,
        accessToken: String,
      },
      instagram: {
        connected: { type: Boolean, default: false },
        handle: String,
        accessToken: String,
      },
      tiktok: {
        connected: { type: Boolean, default: false },
        handle: String,
        accessToken: String,
      },
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Channel', channelSchema);
