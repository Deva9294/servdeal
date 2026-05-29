import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ['customer', 'provider', 'admin', 'superadmin'],
      default: 'customer',
    },
    avatar: String,
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    refreshToken: String,
    addresses: [addressSchema],
    walletBalance: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    loyaltyPoints: { type: Number, default: 0 },
    preferredLanguage: { type: String, default: 'en' },
    city: { type: String, default: 'Patna' },
    state: { type: String, default: 'Bihar' },
    notificationsEnabled: { type: Boolean, default: true },
    fcmToken: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
