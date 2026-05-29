import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    message: String,
    type: { type: String, enum: ['booking', 'payment', 'system', 'chat', 'promo'] },
    link: String,
    isRead: { type: Boolean, default: false },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
