import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one digit'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verifyEmailSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  otp: z.string().length(6).regex(/^\d+$/, 'OTP must be exactly 6 digits'),
});

export const resendOtpSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export const loginRequestSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  phone: z.string().trim().optional(),
});

export const loginVerifySchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  phone: z.string().trim().optional(),
  otp: z.string().length(6).regex(/^\d+$/, 'OTP must be exactly 6 digits'),
});
