import { createSlice } from '@reduxjs/toolkit';

const transparentLoaderSlice = createSlice({
  name: 'transparentLoader',
  initialState: {
    isTransparentLoading: false,
  },
  reducers: {
    setTransparentLoading(state, action) {
      state.isTransparentLoading = action.payload;
    },
  },
});

export const { setTransparentLoading } = transparentLoaderSlice.actions;
export default transparentLoaderSlice.reducer;