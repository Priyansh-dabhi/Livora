/**
 * Welcome / First-launch Onboarding Redux Slice
 *
 * Tracks whether the user has experienced the one-time welcome carousel.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface WelcomeState {
  hasSeenWelcome: boolean;
  isHydrated: boolean;
}

const initialState: WelcomeState = {
  hasSeenWelcome: false,
  isHydrated: false,
};

const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    markWelcomeSeen(state) {
      state.hasSeenWelcome = true;
    },
    hydrateWelcome(state, action: PayloadAction<boolean>) {
      state.hasSeenWelcome = action.payload;
      state.isHydrated = true;
    },
  },
});

export const { markWelcomeSeen, hydrateWelcome } = welcomeSlice.actions;
export default welcomeSlice.reducer;
