import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: String,
    slug: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    franchise: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    commissionOverride: Number,
    coordinates: { lat: Number, lng: Number },
  },
  { timestamps: true }
);

export default mongoose.model('City', citySchema);
