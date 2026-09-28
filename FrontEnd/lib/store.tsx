import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import UserSlice from "@/components/ReduxSlices/UserSlice";
import createEventSlice from "@/components/ReduxSlices/CreateEventSlice";
import categorySlice from "@/components/ReduxSlices/CategorySlice"; 
  
export const makeStore = () => {
    return configureStore({
        reducer: {
            user: UserSlice,
            createEvents: createEventSlice,
            category: categorySlice
        },
        devTools: process.env.NODE_ENV !== "production",  
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

 
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;