// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// cloudinary.config({
//   cloud_name: 'dhz0pkov6',
//   api_key: '423828186226757',
//   api_secret: 'tgL1zylZb1axBdWWmcWHG0wu9cE',
// });

// export const CloudinaryStorageConfig = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => ({
//     folder: 'profile_images',
//     resource_type: 'auto',
//     public_id: file.originalname.split('.')[0],
//   }),
// });

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });
