import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: String,
  note: String,
  at: { type: Date, default: Date.now },
});

const notifiedProviderSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  notifiedAt: { type: Date, default: Date.now },
  respondedAt: Date,
  response: { type: String, enum: ['accepted', 'rejected', 'timeout'] },
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
    isEmergency: { type: Boolean, default: false },
    isAutoAssigned: { type: Boolean, default: false },
    autoAssignedAt: Date,
    notifiedProviders: [notifiedProviderSchema],
    assignmentRadiusKm: { type: Number, default: 10 },
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
    baseAmount: { type: Number, default: 0 },
    surgeMultiplier: { type: Number, default: 1 },
    dynamicPricingApplied: { type: Boolean, default: false },
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
    otpVerifiedStart: { type: Boolean, default: false },
    otpVerifiedComplete: { type: Boolean, default: false },
    customerSatisfactionScore: { type: Number, min: 1, max: 5 },
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
