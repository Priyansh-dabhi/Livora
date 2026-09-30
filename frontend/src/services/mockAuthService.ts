/**
 * Mock Auth Service
 *
 * Simulates backend auth API with realistic delays and responses.
 * Replace with real API calls during backend integration.
 */

import type {
  RegisterPayload,
  LoginPayload,
  OtpPayload,
  ResendOtpPayload,
  AuthResponse,
  OtpResponse,
  User,
} from '@/types';
import { MOCK_USER_CREDENTIALS, MOCK_VALID_OTP } from '@/constants';

/** Simulated network delay */
function delay(ms: number = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** In-memory store of registered users (simulates DB) */
const registeredUsers = new Map<string, { password: string; isVerified: boolean }>();

// Pre-populate with default test user
registeredUsers.set(MOCK_USER_CREDENTIALS.email, {
  password: MOCK_USER_CREDENTIALS.password,
  isVerified: true,
});

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function generateToken(): string {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
}

/** Register a new user */
export async function register(payload: RegisterPayload): Promise<User> {
  await delay(600);

  if (registeredUsers.has(payload.email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }

  const email = payload.email.toLowerCase();
  registeredUsers.set(email, {
    password: payload.password,
    isVerified: false,
  });

  return {
    id: generateUserId(),
    email,
    isVerified: false,
    isProfileComplete: false,
    createdAt: new Date().toISOString(),
  };
}

/** Verify OTP for email verification */
export async function verifyOtp(payload: OtpPayload): Promise<OtpResponse> {
  await delay(500);

  const user = registeredUsers.get(payload.email.toLowerCase());
  if (!user) {
    throw new Error('User not found');
  }

  if (payload.otp === MOCK_VALID_OTP) {
    user.isVerified = true;
    return { success: true, message: 'Email verified successfully' };
  }

  throw new Error('Invalid OTP. Please try again.');
}

/** Resend OTP */
export async function resendOtp(
  payload: ResendOtpPayload,
): Promise<OtpResponse> {
  await delay(400);

  const user = registeredUsers.get(payload.email.toLowerCase());
  if (!user) {
    throw new Error('User not found');
  }

  // In real app, this would trigger an email.
  // Mock: always succeeds.
  return { success: true, message: 'OTP sent to your email' };
}

/** Login with email and password */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await delay(700);

  const email = payload.email.toLowerCase();
  const user = registeredUsers.get(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.password !== payload.password) {
    throw new Error('Invalid email or password');
  }

  if (!user.isVerified) {
    throw new Error('UNVERIFIED');
  }

  return {
    user: {
      id: generateUserId(),
      email,
      isVerified: true,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
    },
    token: generateToken(),
  };
}

/** Logout (clears token — real implementation will hit server) */
export async function logoutUser(): Promise<void> {
  await delay(200);
  // In real app, invalidate token on server
}
