import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './slices/blogSlice';

export const store = configureStore({
  reducer: {
    blogs: blogReducer,
    // Add other reducers here as needed
  },
});