/**
 * Mock Data — Categories and Tasks
 *
 * Isolated from UI for easy backend replacement.
 * Uses structured 3-level data hierarchy from SERVICE_CATEGORIES.
 */

import { SERVICE_CATEGORIES, ALL_FLATTENED_TASKS } from './serviceCatalog';

export const MOCK_CATEGORIES = SERVICE_CATEGORIES;
export const MOCK_TASKS = ALL_FLATTENED_TASKS;

/** Mock registered user for auth simulation */
export const MOCK_USER_CREDENTIALS = {
  email: 'test@livora.com',
  password: 'Password@123',
};

/** The OTP that the mock service accepts */
export const MOCK_VALID_OTP = '123456';

/** OTP validity duration in seconds (10 minutes) */
export const OTP_VALIDITY_SECONDS = 600;

/** Resend cooldown in seconds */
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

/** Maximum incorrect OTP attempts */
export const MAX_OTP_ATTEMPTS = 5;
