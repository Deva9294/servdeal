import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = (buffer, folder) => {
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
  await cloudinary.uploader.destroy(publicId);
};
