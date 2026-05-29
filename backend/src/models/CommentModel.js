import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    content: {
      type: String,
      required: true,
      maxlength: 5000,
      trim: true,
    },
    
    likes: {
      type: Number,
      default: 0,
    },
    
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: String,
        likes: { type: Number, default: 0 },
        createdAt: Date,
      },
    ],
    
    isApproved: {
      type: Boolean,
      default: true,
    },
    
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Comment', commentSchema);
