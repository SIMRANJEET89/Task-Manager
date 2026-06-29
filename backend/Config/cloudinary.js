import {v2 as cloudinary} from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params : {
        folder : 'avatars',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    }
})

const uploadCloud = multer({storage: storage})

export default uploadCloud