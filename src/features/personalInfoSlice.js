import { createSlice } from "@reduxjs/toolkit"


const initialState = {

}

export const personalInfoSlice = createSlice({
    name: 'personalInfo',
    initialState,
    reducers: {
        updateInfo: (state, action) => {
            state.info = action.payload;
        }
    }
})

export const {updateInfo} = personalInfoSlice.actions;

export const selectInfo = (state) => state.personalInfo.info;

export default personalInfoSlice.reducer;