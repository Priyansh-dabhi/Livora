/**
 * Profile Redux Slice
 *
 * Manages user profile state: profile data, completion status.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Profile, ProfileState } from '@/types';

const initialState: ProfileState = {
  profile: null,
  isProfileComplete: false,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
      state.isProfileComplete = true;
      state.isLoading = false;
      state.error = null;
    },

    clearProfile(state) {
      state.profile = null;
      state.isProfileComplete = false;
      state.isLoading = false;
      state.error = null;
    },

    /** Hydrate profile state from persisted storage on app launch */
    hydrateProfile(state, action: PayloadAction<Profile | null>) {
      if (action.payload) {
        state.profile = action.payload;
        state.isProfileComplete = true;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  clearProfile,
  hydrateProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
