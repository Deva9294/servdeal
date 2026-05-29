import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    notificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export default mongoose.model('Subscription', subscriptionSchema);
