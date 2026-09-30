/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import tasksReducer from './tasksSlice';
import onboardingReducer from './onboardingSlice';
import welcomeReducer from './welcomeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    tasks: tasksReducer,
    onboarding: onboardingReducer,
    welcome: welcomeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
