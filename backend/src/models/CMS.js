import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema(
  {
    pageKey: { type: String, required: true, unique: true },
    title: String,
    content: String,
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
    banners: [
      {
        title: String,
        subtitle: String,
        image: String,
        link: String,
        isActive: Boolean,
      },
    ],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('CMS', cmsSchema);
