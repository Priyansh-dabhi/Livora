/**
 * Onboarding Redux Slice
 *
 * Tracks whether the user has completed initial onboarding.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
}

const initialState: OnboardingState = {
  hasCompletedOnboarding: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    completeOnboarding(state) {
      state.hasCompletedOnboarding = true;
    },

    resetOnboarding(state) {
      state.hasCompletedOnboarding = false;
    },

    hydrateOnboarding(state, action: PayloadAction<boolean>) {
      state.hasCompletedOnboarding = action.payload;
    },
  },
});

export const { completeOnboarding, resetOnboarding, hydrateOnboarding } =
  onboardingSlice.actions;

export default onboardingSlice.reducer;
