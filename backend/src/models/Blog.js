import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    coverImage: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    isPublished: { type: Boolean, default: true },
    metaTitle: String,
    metaDescription: String,
    readTime: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);
