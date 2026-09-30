/**
 * Profile-related type definitions
 */

export interface Profile {
  id: string;
  userId: string;
  name: string;
  mobileNumber: string;
  address: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePayload {
  name: string;
  mobileNumber: string;
  address: string;
  businessName?: string;
}

export interface ProfileState {
  profile: Profile | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  error: string | null;
}
