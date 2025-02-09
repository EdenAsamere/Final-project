import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'collateral_documents',
      format: file.mimetype.split('/')[1],
      public_id: `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`
    };
  }
});

const upload = multer({ storage });

export default upload;
