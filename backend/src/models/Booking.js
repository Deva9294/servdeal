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
    category: { type: String, required: true },

    // Scheduling
    scheduledAt: { type: Date, required: true },
    timeSlot: { type: String }, // e.g., "10:00-11:00"
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      lat: Number,
      lng: Number,
    },

    // Status flow: pending -> upcoming -> in_progress -> completed -> paid
    status: {
      type: String,
      enum: ['pending', 'upcoming', 'in_progress', 'completed', 'paid', 'cancelled'],
      default: 'pending',
    },

    // Customer description at booking time
    customerNotes: { type: String, maxlength: 2000 },
    voiceNoteUrl: { type: String },

    // Provider enters final amount after job completion
    estimatedAmount: { type: Number, default: 0 },
    finalAmount: { type: Number },
    providerNotes: { type: String, maxlength: 1000 },

    // Payment (post-service via PayU)
    paymentMethod: {
      type: String,
      enum: ['payu', 'upi', 'cod'],
      default: 'payu',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    payuPaymentLink: { type: String },
    payuTxnId: { type: String },

    // Timeline & tracking
    timeline: [timelineSchema],
    providerLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    etaMinutes: Number,

    // Review after payment
    customerRating: { type: Number, min: 1, max: 5 },
    customerReview: { type: String, maxlength: 1000 },
    providerRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

bookingSchema.pre('save', function generateBookingId(next) {
  if (!this.bookingId) {
    this.bookingId = `BK${Date.now().toString().slice(-6)}`;
  }
  next();
});

// Prevent double booking for same provider + timeSlot + scheduledAt date
bookingSchema.index({ provider: 1, scheduledAt: 1, timeSlot: 1 });
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });

export default mongoose.model('Booking', bookingSchema);
