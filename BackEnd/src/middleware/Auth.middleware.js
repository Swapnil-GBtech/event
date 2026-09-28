 import jwt from "jsonwebtoken";
 import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
 import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError/ApiError.js";

   export const isAuth = asynchandler(async (req, res, next) => {
     try {
       const token = req.cookies.refreshToken;
       if (!token) {
            throw new ApiError(401, "Unauthorized User Please Looged in");
       }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = await User.findById(decoded.id);
       next();
     } catch (error) {
       throw new ApiError(401, error.message);
     }
   })