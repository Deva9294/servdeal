import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  duration: String,
  features: [String],
});

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    shortDescription: String,
    description: String,
    icon: String,
    image: String,
    basePrice: { type: Number, required: true },
    packages: [packageSchema],
    faqs: [{ question: String, answer: String }],
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isEmergency: { type: Boolean, default: false },
    relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
