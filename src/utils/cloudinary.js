import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// uploading...
const uploadOnCloudinary = async function(localFilePath){
    try {
        const uploadResult = await cloudinary.uploader.upload(
           localFilePath, 
           {
               resource_type: "auto",
           }
        );
        fs.unlinkSync(localFilePath);
        console.log('File uploaded successfully on cloudinary-',uploadResult.url);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log('File upload failed, file removed from server');
        return null;
    }
}

export {uploadOnCloudinary};