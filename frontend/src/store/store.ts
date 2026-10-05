/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/services/api';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import tasksReducer from './tasksSlice';
import onboardingReducer from './onboardingSlice';
import welcomeReducer from './welcomeSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    profile: profileReducer,
    tasks: tasksReducer,
    onboarding: onboardingReducer,
    welcome: welcomeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
