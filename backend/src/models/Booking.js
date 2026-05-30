import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: String,
  note: String,
  at: { type: Date, default: Date.now },
});

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    packageName: String,
    scheduledAt: { type: Date, required: true },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled', 'disputed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'payu', 'upi', 'wallet', 'cod'],
      default: 'payu',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    amount: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    providerEarning: { type: Number, default: 0 },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    notes: String,
    timeline: [timelineSchema],
    providerLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    etaMinutes: Number,
    invoiceUrl: String,
  },
  { timestamps: true }
);

bookingSchema.pre('save', function generateBookingId(next) {
  if (!this.bookingId) {
    this.bookingId = `BK${Date.now().toString().slice(-6)}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
