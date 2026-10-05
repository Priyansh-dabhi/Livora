import prisma from '../lib/prisma';
import { ApiError } from '../utils/apiError';
import { hashPassword } from '../utils/otp';
import { createChallenge, verifyChallenge, canResend } from './otp.service';
import { sendEmailVerificationOtp, sendLoginOtp } from './email.service';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';
import * as schemas from '../validators/auth.validator';
import { OtpPurpose } from '@prisma/client';

export const register = async (data: z.infer<typeof schemas.registerSchema>) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash: hashedPassword,
    },
  });

  const otp = await createChallenge(user.id, OtpPurpose.EMAIL_VERIFICATION);
  await sendEmailVerificationOtp(user.email, otp);

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    message: 'Registration successful. Please verify your email.',
  };
};

export const verifyEmail = async (data: z.infer<typeof schemas.verifyEmailSchema>) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  if (user.emailVerifiedAt) {
    return { message: 'Email already verified' };
  }

  await verifyChallenge(user.id, OtpPurpose.EMAIL_VERIFICATION, data.otp);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });

  const token = generateToken(updatedUser.id);

  return {
    message: 'Email verified successfully',
    token,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      address: updatedUser.address,
      businessName: updatedUser.businessName,
      isVerified: true,
      isProfileComplete: Boolean(updatedUser.name && updatedUser.phone),
      createdAt: updatedUser.createdAt.toISOString(),
    }
  };
};

export const resendEmailOtp = async (data: z.infer<typeof schemas.resendOtpSchema>) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  if (user.emailVerifiedAt) {
    throw new ApiError(400, 'Email already verified');
  }

  const resendStatus = await canResend(user.id, OtpPurpose.EMAIL_VERIFICATION);
  if (!resendStatus.allowed) {
    throw new ApiError(400, `Please wait ${resendStatus.waitSeconds} seconds before resending`);
  }

  const otp = await createChallenge(user.id, OtpPurpose.EMAIL_VERIFICATION);
  await sendEmailVerificationOtp(user.email, otp);

  return { message: 'Verification OTP sent successfully' };
};

export const requestLoginOtp = async (data: z.infer<typeof schemas.loginRequestSchema>) => {
  const successMessage = { message: 'If an account exists, a login code has been sent.' };
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
    throw new ApiError(404, 'No account found with this email');
  }

  if (!user.emailVerifiedAt) {
    throw new ApiError(403, 'Email not verified. Please verify your email first.');
  }

  if (data.phone && user.phone && user.phone !== data.phone) {
    return successMessage;
  }

  const resendStatus = await canResend(user.id, OtpPurpose.LOGIN);
  if (!resendStatus.allowed) {
    throw new ApiError(400, `Please wait ${resendStatus.waitSeconds} seconds before resending`);
  }

  const otp = await createChallenge(user.id, OtpPurpose.LOGIN);
  await sendLoginOtp(user.email, otp);

  return successMessage;
};

export const verifyLoginOtp = async (data: z.infer<typeof schemas.loginVerifySchema>) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user || !user.emailVerifiedAt) {
    console.error(`[DEBUG verifyLoginOtp] Auth failed for email: ${data.email}. User exists: ${!!user}, emailVerifiedAt: ${user?.emailVerifiedAt}`);
    throw new ApiError(401, 'Invalid credentials');
  }

  if (data.phone && user.phone && user.phone !== data.phone) {
     console.error(`[DEBUG verifyLoginOtp] Phone mismatch. Provided: ${data.phone}, Expected: ${user.phone}`);
     throw new ApiError(401, 'Invalid credentials');
  }

  await verifyChallenge(user.id, OtpPurpose.LOGIN, data.otp);

  const token = generateToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      businessName: user.businessName,
      isVerified: Boolean(user.emailVerifiedAt),
      isProfileComplete: Boolean(user.name && user.phone),
      createdAt: user.createdAt.toISOString(),
    }
  };
};
