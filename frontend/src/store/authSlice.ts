/**
 * Auth Redux Slice
 *
 * Manages authentication state: user, token, loading, errors.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    registerSuccess(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
    },

    verifyEmailSuccess(state) {
      if (state.user) {
        state.user.isVerified = true;
      }
      state.isLoading = false;
      state.error = null;
    },

    markProfileComplete(state) {
      if (state.user) {
        state.user.isProfileComplete = true;
      }
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /** Hydrate auth state from persisted storage on app launch */
    hydrateAuth(
      state,
      action: PayloadAction<{ user: User; token: string } | null>,
    ) {
      if (action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  verifyEmailSuccess,
  markProfileComplete,
  logout,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;
