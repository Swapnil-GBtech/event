import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import {craeteEvents,updateEvents,deleteEvent,getEvents} from "../ApiServices/ApiServices";

   export const createEventsThunk = createAsyncThunk(
     'createEvents/createEventsThunk',
     async (formData: any, { rejectWithValue }) => {
       try {
         const response = await craeteEvents(formData);
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )

   export const updateEventsThunk = createAsyncThunk(
     'createEvents/updateEventsThunk',
     async ({id,formData}:{id:string,formData:FormData}, { rejectWithValue }) => {
       try {
         const response = await updateEvents(id,formData);
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )


   export const deleteEventThunk = createAsyncThunk(
     'createEvents/deleteEventThunk',
     async (id: any, { rejectWithValue }) => {
       try {
         const response = await deleteEvent(id);
         return response // ✅ If using Axios, return response.data instead of response
       } catch (error: any) {
         // ✅ Proper error structure for known error formats
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return rejectWithValue(message);
       }
     }
   )

   export const getAllEventsThunk = createAsyncThunk(
     'createEvents/getAllEventsThunk',
     async (id, thunkAPI) => {
       try {
         const response = await getEvents(id);
         return response; // or response.data if using Axios
       } catch (error: any) {
         const message =
           error.response?.data?.message || error.message || 'Something went wrong';
         return thunkAPI.rejectWithValue(message);
       }
     }
   )


const InitialsState = {
      events:[],
      allevents:[],
      loading:false,
      error:"",
      createEventFormData:{
      Event_title: "",
      Description: "",
      eventdate: "",
      Time: "",
      location: "",
      Category: "",
      Price: "",
      Organizer: "",
      image:null
      },
}

const UserSlice = createSlice({
    name:"createEvents",
    initialState:InitialsState,
    reducers:{
        setFormData:(state,action)=>{
            state.createEventFormData = {...state.createEventFormData,...action.payload}
        },
        resetFormData:(state)=>{
            state.createEventFormData = {...InitialsState.createEventFormData}
            state.createEventFormData = InitialsState.createEventFormData
        },
    },
    
    extraReducers:(builder)=>{
        builder.addCase(createEventsThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(createEventsThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.events = action.payload
        }),
        builder.addCase(createEventsThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })

        // ================= Update Event ===================

           builder.addCase(updateEventsThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(updateEventsThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.events = action.payload
        }),
        builder.addCase(updateEventsThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })


        // ================= Delete Event ===================

        builder.addCase(deleteEventThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(deleteEventThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.events = action.payload.data
        }),
        builder.addCase(deleteEventThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })


        // ================= Get All Events ===================

          builder.addCase(getAllEventsThunk.pending,(state)=>{
            state.loading = true
        }),
        builder.addCase(getAllEventsThunk.fulfilled,(state,action)=>{
            state.loading = false
            state.allevents = action.payload.data
        }),
        builder.addCase(getAllEventsThunk.rejected,(state,action)=>{
            state.loading = false
            state.error = action.error.message
        })

    }
})


export const {setFormData,resetFormData} = UserSlice.actions
export default UserSlice.reducer
