/**
 * Auth-related type definitions
 */

export interface User {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  isVerified: boolean;
  isProfileComplete: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequestPayload {
  email: string;
  phone?: string;
}

export interface LoginVerifyPayload {
  email: string;
  phone?: string;
  otp: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}
