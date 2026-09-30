/**
 * Validation Utility Functions
 *
 * Pure functions — no side effects, no state. Used by hooks and services.
 */

/** Validate email format */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/** Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number) */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

/** Get password validation errors */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) {
    errors.push('At least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('One number');
  }
  return errors;
}

/** Validate Indian mobile number (10 digits, starts with 6-9) */
export function isValidIndianMobile(number: string): boolean {
  const cleaned = number.replace(/\s/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

/** Validate name (min 2 chars, only letters and spaces) */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
}

/** Validate address (min 5 chars) */
export function isValidAddress(address: string): boolean {
  return address.trim().length >= 5;
}

/** Validate OTP (exactly 6 digits) */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/** Format seconds to mm:ss */
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
