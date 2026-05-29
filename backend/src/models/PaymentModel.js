import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    paymentId: {
      type: String,
      unique: true,
    },
    
    amount: {
      type: Number,
      required: true,
    },
    
    currency: {
      type: String,
      default: 'INR',
    },
    
    paymentType: {
      type: String,
      enum: ['subscription', 'credits', 'withdrawal'],
      required: true,
    },
    
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet'],
    },
    
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    
    subscriptionPlan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
    },
    
    creditsReceived: Number,
    
    transactionId: String,
    
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    
    description: String,
    
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ paymentId: 1 });

export default mongoose.model('Payment', paymentSchema);
