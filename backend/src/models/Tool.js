import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, trim: true },
    category: { type: String, enum: ['power', 'hand', 'electrical', 'plumbing', 'gardening', 'cleaning', 'safety', 'other'], default: 'hand' },
    images: [String],
    pricePerDay: { type: Number, required: true, min: 0 },
    pricePerWeek: { type: Number, default: 0 },
    pricePerMonth: { type: Number, default: 0 },
    deposit: { type: Number, default: 0 },
    condition: { type: String, enum: ['new', 'excellent', 'good', 'fair'], default: 'good' },
    location: {
      city: String,
      state: String,
      lat: Number,
      lng: Number,
    },
    isAvailable: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalRentals: { type: Number, default: 0 },
    minRentalDays: { type: Number, default: 1 },
  },
  { timestamps: true }
);

toolSchema.index({ owner: 1 });
toolSchema.index({ category: 1, isAvailable: 1 });
toolSchema.index({ slug: 1 });
toolSchema.index({ 'location.city': 1 });

export default mongoose.model('Tool', toolSchema);
