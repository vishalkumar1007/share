import { combineReducers } from "@reduxjs/toolkit";
import userProfileDataReducer from '../features/apiCollections/userProfileData/userProfileDataSlice'

const rootReducer = combineReducers({
    userProfileData:userProfileDataReducer
})

export default rootReducer;