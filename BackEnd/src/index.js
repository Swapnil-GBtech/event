import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
}) 
import ApiError from "./utils/ApiError/ApiError.js"
 
import  express from "express"
import { connectDB } from "./dbconfig/ConnectDb.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import path from "path"
import userRouter from "./router/user.router.js"
import createEventRouter from "./router/event.router.js"
import CategoryRouter from "./router/category.router.js"
import assignEventRouter from "./router/assignevent.router.js"
import paymentRouter from "./router/payment.router.js"

 
const PORT = process.env.PORT || 6000
const app = express();
 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
))

const uploadPath = path.join("uploads");
if(!fs.existsSync(uploadPath)){
   fs.mkdirSync(uploadPath)
}

app.use("/api/v1/user",userRouter)
app.use('/api/v1/event',createEventRouter)
app.use('/api/v1/category',CategoryRouter)
app.use("/api/v1/assignevnents",assignEventRouter)
app.use("/api/v1/payment",paymentRouter)


app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});
    app.listen(PORT,async()=>{
        try {
            await connectDB()
            console.log(`Server is running on port ${PORT}`)
        } catch (error) {
            console.log("error",error)
        }
    })

 
