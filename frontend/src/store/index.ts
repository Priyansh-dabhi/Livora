/**
 * Store barrel export
 */

export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';

// Auth slice
export {
  setLoading as setAuthLoading,
  setError as setAuthError,
  loginSuccess,
  registerSuccess,
  verifyEmailSuccess,
  markProfileComplete,
  logout,
  hydrateAuth,
} from './authSlice';

// Profile slice
export {
  setLoading as setProfileLoading,
  setError as setProfileError,
  setProfile,
  clearProfile,
  hydrateProfile,
} from './profileSlice';

// Tasks slice
export {
  setLoading as setTasksLoading,
  setError as setTasksError,
  setCategories,
  setTasks,
  setSelectedCategory,
  toggleTaskSelection,
  removeTaskSelection,
  setSelectedTaskIds,
  setSearchQuery,
  clearSelections,
  clearTasksState,
  hydrateSelectedTasks,
} from './tasksSlice';

// Onboarding slice
export {
  completeOnboarding,
  resetOnboarding,
  hydrateOnboarding,
} from './onboardingSlice';

// Welcome slice (first-time onboarding carousel)
export {
  markWelcomeSeen,
  hydrateWelcome,
} from './welcomeSlice';
