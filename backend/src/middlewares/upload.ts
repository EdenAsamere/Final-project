import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    
    try {
      console.log(file)
      return {
        folder: 'collateral_documents',
        format: file.mimetype.split('/')[1],
        public_id: `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`,
        
      };
     
    } catch (error) {
      console.log("Error with CloudinaryStorage:", error);
      throw error;
    }

  },
  
});


const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});
export default upload;
