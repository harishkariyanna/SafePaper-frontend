import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import fullLoaderReducer from "./slices/fullLoaderSlice";
import transparentLoaderReducer from "./slices/transparentLoaderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fullLoader: fullLoaderReducer,
    transparentLoader: transparentLoaderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
