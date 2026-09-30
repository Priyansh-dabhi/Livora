/**
 * Services barrel export
 */

export {
  register,
  verifyOtp,
  resendOtp,
  login,
  logoutUser,
} from './mockAuthService';

export { getProfile, saveProfile } from './mockProfileService';

export {
  getCategories,
  getTasks,
  saveSelectedTasks,
  getSelectedTasks,
} from './mockTaskService';
