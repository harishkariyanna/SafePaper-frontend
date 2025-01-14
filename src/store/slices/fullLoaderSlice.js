import { createSlice } from '@reduxjs/toolkit';

const fullLoaderSlice = createSlice({
  name: 'fullLoader',
  initialState: {
    isFullScreenLoading: false,
  },
  reducers: {
    setFullScreenLoading(state, action) {
      state.isFullScreenLoading = action.payload;
    },
  },
});

export const { setFullScreenLoading } = fullLoaderSlice.actions;
export default fullLoaderSlice.reducer;