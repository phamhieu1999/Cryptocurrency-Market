
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptoSlice';
import authReducer from './authSlice';
import communityReducer from './communitySlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    auth: authReducer,
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
