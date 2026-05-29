import mongoose from 'mongoose';

const aiGenerationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
    },
    
    // Generation Request
    prompt: {
      type: String,
      required: true,
    },
    
    // Generated Content
    script: {
      content: String,
      duration: Number,
      scenes: [
        {
          sceneNumber: Number,
          text: String,
          duration: Number,
          imagePrompt: String,
        },
      ],
    },
    
    // Voice Generation
    voiceover: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
      },
      voiceType: String,
      language: String,
      url: String,
      duration: Number,
    },
    
    // Image Generation
    images: [
      {
        sceneNumber: Number,
        prompt: String,
        url: String,
        status: {
          type: String,
          enum: ['pending', 'processing', 'completed', 'failed'],
        },
      },
    ],
    
    // Subtitle Generation
    subtitles: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
      },
      language: String,
      url: String,
      content: String,
    },
    
    // Video Composition
    video: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
      },
      url: String,
      duration: Number,
      resolution: String,
      format: { type: String, default: 'mp4' },
    },
    
    // Generation Settings
    settings: {
      style: String,
      duration: Number,
      resolution: String,
      fps: Number,
      includeMusic: { type: Boolean, default: true },
      includeTransitions: { type: Boolean, default: true },
    },
    
    // Progress & Status
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // Costs & Credits
    creditsCost: {
      type: Number,
      default: 0,
    },
    costBreakdown: {
      scriptGeneration: Number,
      voiceGeneration: Number,
      imageGeneration: Number,
      videoRendering: Number,
      subtitleGeneration: Number,
    },
    
    // Error Handling
    errorMessage: String,
    errorDetails: mongoose.Schema.Types.Mixed,
    
    // Timing
    startedAt: Date,
    completedAt: Date,
    totalDuration: Number, // in seconds
  },
  {
    timestamps: true,
  }
);

// Indexes
aiGenerationSchema.index({ user: 1, status: 1 });
aiGenerationSchema.index({ channel: 1 });
aiGenerationSchema.index({ createdAt: -1 });

export default mongoose.model('AIGeneration', aiGenerationSchema);
