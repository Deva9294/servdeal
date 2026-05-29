import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    // Video Media
    videoUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    thumbnail: {
      type: String,
    },
    resolution: {
      type: String,
      enum: ['360p', '480p', '720p', '1080p', '4K'],
      default: '1080p',
    },
    
    // AI Generation Data
    isAIGenerated: {
      type: Boolean,
      default: false,
    },
    aiGenerationData: {
      prompt: String,
      script: String,
      voiceType: String,
      language: String,
      style: String,
      generatedAt: Date,
      generationTime: Number, // in seconds
    },
    
    // Content
    script: String,
    voiceover: {
      url: String,
      language: String,
      voiceType: String,
      duration: Number,
    },
    subtitles: [
      {
        language: String,
        url: String,
        content: String,
      },
    ],
    
    // Metadata
    tags: [String],
    category: {
      type: String,
      enum: ['Education', 'Entertainment', 'Gaming', 'Music', 'News', 'Sports', 'Tech', 'Other'],
      default: 'Other',
    },
    language: {
      type: String,
      default: 'en',
    },
    
    // Status
    status: {
      type: String,
      enum: ['draft', 'processing', 'ready', 'published', 'failed', 'archived'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'private',
    },
    
    // Publishing
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    scheduledPublishAt: Date,
    
    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    watchTime: {
      type: Number,
      default: 0, // in seconds
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
    
    // Platform Uploads
    platformUploads: {
      youtube: {
        uploaded: { type: Boolean, default: false },
        videoId: String,
        url: String,
        uploadedAt: Date,
      },
      instagram: {
        uploaded: { type: Boolean, default: false },
        postId: String,
        url: String,
        uploadedAt: Date,
      },
      tiktok: {
        uploaded: { type: Boolean, default: false },
        videoId: String,
        url: String,
        uploadedAt: Date,
      },
      facebook: {
        uploaded: { type: Boolean, default: false },
        videoId: String,
        url: String,
        uploadedAt: Date,
      },
    },
    
    // SEO
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    
    // Monetization
    monetizationApplied: {
      type: Boolean,
      default: false,
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
videoSchema.index({ channel: 1, status: 1 });
videoSchema.index({ uploadedBy: 1 });
videoSchema.index({ isPublished: 1, publishedAt: -1 });
videoSchema.index({ tags: 1 });

export default mongoose.model('Video', videoSchema);
