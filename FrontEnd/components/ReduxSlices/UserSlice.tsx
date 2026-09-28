import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../ApiServices/ApiServices";
import { loginUser } from "../ApiServices/ApiServices";
import { logoutUser } from "../ApiServices/ApiServices";
import {getAllOrganizer,getAllUsers} from "../ApiServices/ApiServices";
import { all } from "axios";

export const registerUserThunk = createAsyncThunk(
  'user/registerUserThunk',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await registerUser(formData);
      return response // ✅ If using Axios, return response.data instead of response
    } catch (error: any) {
      // ✅ Proper error structure for known error formats
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/loginUserThunk',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await loginUser(formData);
      return response // ✅ If using Axios, return response.data instead of response
    } catch (error: any) {
      // ✅ Proper error structure for known error formats
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      return rejectWithValue(message);
    }
  }
)

 export const logoutUserThunk = createAsyncThunk(
  'user/logoutUserThunk',
  async (_, thunkAPI) => {
    try {
      const response = await logoutUser();
      return response; // or response.data if using Axios
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

 export const getAllOrganizerThunk = createAsyncThunk(
  'user/getAllOrganizerThunk',
  async (_, thunkAPI) => {
    try {
      const response = await getAllOrganizer();
      return response; // or response.data if using Axios
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const getAllUsersThunk = createAsyncThunk(
  'user/getAllUsersThunk',
  async (_, thunkAPI) => {
    try {
      const response = await getAllUsers();
      return response; // or response.data if using Axios
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
)




const InitialsState = {
      users:[],
      allUsers:[],
      allOrganizer:[],
      loading:false,
      error:"",
      formdata:{
        name:"",
        email:"",
        password:"",
        role:"",
        organization:"",
        subscriptionType:"",
        price:0,
        Monthly:"",
        Yearly:"",
        phone:9027130674,
        address:""
      },
      loginformdata:{
        email:"",
        password:""
      }
}


const UserSlice = createSlice({
    name:"user",
    initialState:InitialsState,
    reducers:{
        setFormData:(state,action)=>{
            state.formdata = {...state.formdata,...action.payload}
        },
        resetFormData:(state)=>{
            state.formdata = InitialsState.formdata
        },
        setloginformdata:(state,action)=>{
            state.loginformdata = {...state.loginformdata,...action.payload}
        },
        resetloginformdata:(state)=>{
            state.loginformdata = InitialsState.loginformdata
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUserThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(registerUserThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.users = action.payload
        }),
        builder.addCase(registerUserThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })


        // ================ Login User ===================


           builder.addCase(loginUserThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(loginUserThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.users = action.payload
        }),
        builder.addCase(loginUserThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })



        // ========================logout User ==============

           builder.addCase(logoutUserThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(logoutUserThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.users = action.payload
        }),
        builder.addCase(logoutUserThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })

        // =================get All Organizer ==============

          builder.addCase(getAllOrganizerThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(getAllOrganizerThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.allOrganizer = action.payload
        }),
        builder.addCase(getAllOrganizerThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })


        // =================get All Users ==============

        builder.addCase(getAllUsersThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(getAllUsersThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.allUsers = action.payload.data
        }),
        builder.addCase(getAllUsersThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })
    }
})


export const {setFormData,resetFormData,setloginformdata,resetloginformdata} = UserSlice.actions
export default UserSlice.reducer
