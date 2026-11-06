import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./feature/baseApi";
import authSlice from "./reducer/authSlice";

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
