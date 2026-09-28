import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
import ApiError from "../utils/ApiError/ApiError.js";
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import {Category} from "../models/Category.model.js";


export const  CreateCategry = asynchandler(async(req,res)=>{
    try {
        const {name,organizationId} = req.body;
        if(!name){
            throw new ApiError(400,"Category name is required")
        }
        if(!organizationId){
            throw new ApiError(400,"OrganizationId is required")
        }
        const existCategory = await Category.findOne({Category_name:name,createdBy:organizationId});
        if(existCategory){
            throw new ApiError(400,"Category already exist")
        }
        const category = await Category.create({Category_name:name,createdBy:organizationId});
        return res.status(201).json(new ApiResponse(201,category,"Category created successfully"))
    } catch (error) {
        throw new ApiError(400,error.message)
    }
})

export const UpdateCategory = asynchandler(async(req,res)=>{
    try {
         const {organizationId,categoryId,name} = req.body;
        if(!categoryId){
            throw new ApiError(400,"categoryId is required")
        }

        if(!organizationId){
            throw new ApiError(400,"OrganizationId is required")
        }
        
        const category = await Category.findByIdAndUpdate(categoryId,{Category_name:name},{new:true});
        if(!category){
            throw new ApiError(400,"Category not found")
        }
        return res.status(201).json(new ApiResponse(201,category,"Category updated successfully"))
    } catch (error) {
        throw new ApiError(400,error.message)
    }
})

export const deleteCategory = asynchandler(async(req,res)=>{
    try {
         const {categoryId} = req.query;
         if(!categoryId){
            throw new ApiError(400,"categoryId is required")
        }
    
        const category = await Category.findByIdAndDelete(categoryId);
        if(!category){
            throw new ApiError(400,"Category not found")
        }
        return res.status(201).json(new ApiResponse(true,category,"Category deleted successfully"))
    } catch (error) {
        throw new ApiError(error.message,400)
    }
})

export const getAllCategory = asynchandler(async(req,res)=>{
    try {
        const category = await Category.find();
        if(!category){
            throw new ApiError(400,"Category not found")
        }
        return res.status(201).json(new ApiResponse(true,category,"Category found successfully"))
    } catch (error) {
        throw new ApiError(400,error.message)
    }
})