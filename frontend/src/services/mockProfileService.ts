/**
 * Mock Profile Service
 *
 * Simulates backend profile API with realistic delays.
 * Replace with real API calls during backend integration.
 */

import type { Profile, ProfilePayload } from '@/types';

/** Simulated network delay */
function delay(ms: number = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Get the user's profile */
export async function getProfile(): Promise<Profile | null> {
  await delay(400);
  // In real app, fetch from server.
  // Mock: return null (profile not set up yet)
  return null;
}

/** Save/create user profile */
export async function saveProfile(payload: ProfilePayload): Promise<Profile> {
  await delay(700);

  // Simulate occasional network failure for error-state testing
  // Uncomment the next 3 lines to test error handling:
  // if (Math.random() < 0.1) {
  //   throw new Error('Network error. Please try again.');
  // }

  const profile: Profile = {
    id: `profile_${Date.now()}`,
    userId: `user_${Date.now()}`,
    name: payload.name,
    mobileNumber: payload.mobileNumber,
    address: payload.address,
    businessName: payload.businessName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return profile;
}
