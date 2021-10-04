import { createSlice } from "@reduxjs/toolkit"

const initialState = {

}

export const planSlice = createSlice({
    name: 'plan',
    initialState,
    reducers:{
        updatePlan: (state, action) => {
            state.details = action.payload
        }
    }
})

export const {updatePlan} = planSlice.actions;

export const selectPlan = (state) => state.plan.details;

export default planSlice.reducer;