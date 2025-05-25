import { createSlice } from "@reduxjs/toolkit";
import {fetchUserProfileDataThunk} from "./userProfileDataThunk";

const initialState = {
    isLoading:false,
    data:null,
    isError:false,
    errorMessage:''
}

const userProfileDataSlice = createSlice({
    name:'userProfileData',
    initialState,
    extraReducers:(builder)=>{
        builder.addCase(fetchUserProfileDataThunk.pending,(state)=>{
            state.isLoading = true
        })
        builder.addCase(fetchUserProfileDataThunk.fulfilled , (state,action)=>{
            if(action.payload){
                state.isLoading = false;
                state.data = action.payload;
            }
        })
        builder.addCase(fetchUserProfileDataThunk.rejected,(state,action)=>{
            state.isError = true;
            state.isLoading = false;
            state.errorMessage = action.error.message;
        })
    }
})

export default userProfileDataSlice.reducer;