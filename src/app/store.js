import { configureStore } from '@reduxjs/toolkit';
import personalInfoReducer from '../features/personalInfoSlice';
import planReducer from '../features/planSlice';

export const store = configureStore({
  reducer: {
    personalInfo: personalInfoReducer,
    plan: planReducer,
  },
});
