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
    message: 'Registration successful. Please verify your email.',
  };
};

export const verifyEmail = async (data: z.infer<typeof schemas.verifyEmailSchema>) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  if (user.emailVerifiedAt) {
    throw new ApiError(400, 'Email already verified');
  }

  await verifyChallenge(user.id, OtpPurpose.EMAIL_VERIFICATION, data.otp);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });

  return { message: 'Email verified successfully' };
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
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  
  // Generic message to prevent enumeration
  const successMessage = { message: 'If an account with this email exists and is verified, an OTP has been sent.' };

  if (!user || !user.emailVerifiedAt) {
    return successMessage;
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
    throw new ApiError(401, 'Invalid credentials');
  }

  if (data.phone && user.phone && user.phone !== data.phone) {
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
    }
  };
};
