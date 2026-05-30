import { v2 as cloudinary } from 'cloudinary';

function ensureConfigured() {
  if (!cloudinary.config().cloud_name) {
    throw new Error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env vars.');
  }
}

export const uploadToCloudinary = (buffer, folder) => {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'auto' }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
      .end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
};
