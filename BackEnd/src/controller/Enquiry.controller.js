import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import ApiError from "../utils/ApiError/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler/AsyncHandler";


export const createEnquiry = asynchandler(async (req, res) => {
     try {
         const {name,email,organizationId,message} = req.body;
     } catch (error) {
         throw new ApiError(400, error.message)
     }
})