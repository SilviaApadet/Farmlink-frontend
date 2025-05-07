// src/features/experts/expertSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all experts/communities
export const fetchExperts = createAsyncThunk('experts/fetchExperts', async () => {
  const response = await axios.get('/api/experts'); // Replace with your real endpoint
  return response.data;
});

// Follow an expert/community
export const followExpert = createAsyncThunk('experts/followExpert', async (id) => {
  const response = await axios.post(`/api/experts/${id}/follow`);
  return response.data;
});

const expertSlice = createSlice({
  name: 'experts',
  initialState: {
    list: [],
    followed: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(followExpert.fulfilled, (state, action) => {
        state.followed.push(action.payload);
      });
  },
});

export default expertSlice.reducer;
