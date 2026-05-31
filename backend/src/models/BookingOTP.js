import mongoose from 'mongoose';

const bookingOTPSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    startOTP: { type: String, length: 6 },
    startOTPExpires: Date,
    startOTPVerified: { type: Boolean, default: false },
    startOTPVerifiedAt: Date,
    completeOTP: { type: String, length: 6 },
    completeOTPExpires: Date,
    completeOTPVerified: { type: Boolean, default: false },
    completeOTPVerifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('BookingOTP', bookingOTPSchema);
