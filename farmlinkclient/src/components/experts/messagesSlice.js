// src/features/messages/messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendMessage = createAsyncThunk('messages/sendMessage', async ({ recipientId, content }) => {
  const response = await axios.post('/api/messages', { recipientId, content });  //replace with full API 
  return response.data;
});

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    sent: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sent.push(action.payload);
    });
  },
});

export default messageSlice.reducer;
