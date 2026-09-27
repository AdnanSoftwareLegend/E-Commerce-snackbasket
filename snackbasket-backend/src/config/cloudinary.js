let cloudinary = null;

try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  cloudinary = null;
}

const uploadToCloudinary = async (filePath, folder = 'snackbasket') => {
  if (!cloudinary) {
    throw new Error('Cloudinary is not configured');
  }
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return result.secure_url;
};

const deleteFromCloudinary = async (publicId) => {
  if (!cloudinary) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };