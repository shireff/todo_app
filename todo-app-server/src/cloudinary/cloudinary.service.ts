import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dhz0pkov6',
      api_key: '423828186226757',
      api_secret: 'tgL1zylZb1axBdWWmcWHG0wu9cE',
    });
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new Error('Invalid file upload');
    }

    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'profile_images',
    });

    return result.secure_url;
  }
}