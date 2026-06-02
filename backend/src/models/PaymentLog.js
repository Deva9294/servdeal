import mongoose from 'mongoose';

const paymentLogSchema = new mongoose.Schema(
  {
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gateway: { type: String, enum: ['payu', 'razorpay', 'stripe', 'wallet', 'cod'], required: true },
    gatewayOrderId: { type: String, index: true },
    gatewayPaymentId: { type: String, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['created', 'initiated', 'paid', 'failed', 'refunded', 'duplicate'],
      default: 'created',
      index: true,
    },
    hashVerified: { type: Boolean, default: false },
    hashMatch: { type: Boolean, default: false },
    responseBody: mongoose.Schema.Types.Mixed,
    errorMessage: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    processedBy: { type: String, enum: ['callback', 'api_verify', 'cron', 'admin'], default: 'callback' },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

paymentLogSchema.index({ createdAt: -1 });
paymentLogSchema.index({ status: 1, gateway: 1 });
paymentLogSchema.index({ gatewayOrderId: 1, status: 1 });

export default mongoose.model('PaymentLog', paymentLogSchema);
