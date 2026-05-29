import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // AI Credits System
    aiCredits: {
      available: { type: Number, default: 100 },
      used: { type: Number, default: 0 },
      purchased: { type: Number, default: 0 },
    },
    
    // Subscription
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
      },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: true },
    },
    
    // Monetization
    earnings: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      withdrawn: { type: Number, default: 0 },
    },
    
    // Social & Integration
    googleId: String,
    youtubeChannels: [
      {
        channelId: String,
        accessToken: String,
        refreshToken: String,
        expiresAt: Date,
      },
    ],
    instagramHandle: String,
    tiktokHandle: String,
    
    // Preferences
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    language: {
      type: String,
      default: 'en',
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
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

export default mongoose.model('User', userSchema);
