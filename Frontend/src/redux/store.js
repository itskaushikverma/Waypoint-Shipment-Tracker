import { configureStore } from '@reduxjs/toolkit';
import { shipmentApi } from './api';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [shipmentApi.reducerPath]: shipmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(shipmentApi.middleware),
});

export default store;
