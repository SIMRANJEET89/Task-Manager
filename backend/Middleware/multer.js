import {v2 as cloudinary} from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer'
import path from 'path'

// Cloudinary credentials configuration
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

//Create Cloudinary storage 
const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'Task-manager-avatar',
        allowed_formats : ['jpg', 'png', 'jpeg']
    }
})
const upload = multer({ storage : storage});

export default upload
