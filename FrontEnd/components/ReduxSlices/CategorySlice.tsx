import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import {getAllCategory,createCategory,updateCategory,deleteCategory} from "../ApiServices/ApiServices";
 

    export const createCategoryThunk = createAsyncThunk(
     'createEvents/createCategoryThunk',
     async (formData: any, { rejectWithValue }) => {
       try {
         const response = await createCategory(formData);
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )

   export const getAllCategoryThunk = createAsyncThunk(
     'category/getAllCategoryThunk',
     async (_, { rejectWithValue }) => {
       try {
         const response = await getAllCategory();
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )

   export const updateCategoryThunk = createAsyncThunk(
     'category/updateCategoryThunk',
     async (formData: any, { rejectWithValue }) => {
       try {
         const response = await updateCategory(formData);
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )

   export const deleteCategoryThunk = createAsyncThunk(
     'category/deleteCategoryThunk',
     async (id: any, { rejectWithValue }) => {
       try {
         const response = await deleteCategory(id);
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )

const InitialsState = {
      category:[],
      allcategory:[],
      loading:false,
      error:"",
      categoryFormData:{
          category_name:""
      }
}

const UserSlice = createSlice({
    name:"category",
    initialState:InitialsState,
    reducers:{
        setCategoryFormData:(state,action)=>{
            state.categoryFormData = {...state.categoryFormData,...action.payload}
        },
        resetCategoryFormData:(state)=>{
            state.categoryFormData = InitialsState.categoryFormData
        },
         
    },
    extraReducers:(builder)=>{
        
          builder.addCase(createCategoryThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(createCategoryThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.category = action.payload
        }),
        builder.addCase(createCategoryThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })


        // =================updateCategory========================

        builder.addCase(updateCategoryThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(updateCategoryThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.category = action.payload
        }),
        builder.addCase(updateCategoryThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })


        // =================deleteCategory========================

        builder.addCase(deleteCategoryThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(deleteCategoryThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.category = action.payload
        }),
        builder.addCase(deleteCategoryThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })
        
        // =================getAllCategory========================

        builder.addCase(getAllCategoryThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(getAllCategoryThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.allcategory = action.payload.data
        }),
        builder.addCase(getAllCategoryThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})


export const {setCategoryFormData,resetCategoryFormData} = UserSlice.actions
export default UserSlice.reducer
