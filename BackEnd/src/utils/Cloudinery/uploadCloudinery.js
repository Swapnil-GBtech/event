 import fs from "fs";
 import { v2 as cloudinary } from "cloudinary";


 export const uploadOnCloudinery = async(localfilepath)=>{
        try {
                if(!localfilepath) return;
                 const response = await cloudinary.uploader.upload(localfilepath,{
                     folder:"Event_Management_System",
                     resource_type:"image"
                 });
                 return response
        } catch (error) {
               fs.unlinkSync(localfilepath)
                throw error
        }
   }