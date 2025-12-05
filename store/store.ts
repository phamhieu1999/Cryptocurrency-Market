
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from './cryptoSlice';
import authReducer from './authSlice';
import communityReducer from './communitySlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    auth: authReducer,
    community: communityReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;