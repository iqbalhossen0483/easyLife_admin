import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducer';
import { baseApi } from './feature/baseApi';

export const store = configureStore({
  reducer: {
    ...rootReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
