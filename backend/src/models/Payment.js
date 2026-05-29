import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: String,
    gateway: { type: String, enum: ['razorpay', 'stripe', 'wallet', 'cod'] },
    gatewayOrderId: String,
    gatewayPaymentId: String,
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    gst: Number,
    invoiceNumber: String,
    refundAmount: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
