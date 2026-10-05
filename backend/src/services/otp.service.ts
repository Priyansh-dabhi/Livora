import { OtpPurpose, OtpChannel } from '@prisma/client';
import prisma from '../lib/prisma';
import { ApiError } from '../utils/apiError';
import { generateOtp, verifyOtp as verifyHash } from '../utils/otp';
import config from '../config';

export const createChallenge = async (userId: string, purpose: OtpPurpose) => {
  // Invalidate any existing active challenges for this user/purpose
  await prisma.otpChallenge.updateMany({
    where: { userId, purpose, consumedAt: null, expiresAt: { gt: new Date() } },
    data: { consumedAt: new Date() }, // Mark old ones as consumed
  });

  const { code, hash } = await generateOtp();
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + config.otp.expiryMinutes);
  
  const resendAvailableAt = new Date();
  resendAvailableAt.setSeconds(resendAvailableAt.getSeconds() + config.otp.resendCooldownSeconds);

  await prisma.otpChallenge.create({
    data: {
      userId,
      channel: OtpChannel.EMAIL,
      purpose,
      codeHash: hash,
      expiresAt,
      resendAvailableAt,
      maxAttempts: config.otp.maxAttempts,
    }
  });

  return code;
};

export const verifyChallenge = async (userId: string, purpose: OtpPurpose, code: string) => {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { userId, purpose, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!challenge) {
    throw new ApiError(400, 'No active OTP found');
  }

  if (new Date() > challenge.expiresAt) {
    throw new ApiError(400, 'OTP expired');
  }

  if (!config.isDevelopment && challenge.attempts >= challenge.maxAttempts) {
    throw new ApiError(400, 'Too many attempts');
  }

  const isDevMasterOtp = config.isDevelopment && code === '123456';
  const isValid = isDevMasterOtp || (await verifyHash(code, challenge.codeHash));

  if (!isValid) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    throw new ApiError(400, 'Invalid OTP');
  }

  if (isDevMasterOtp) {
    console.log(`🔓 [DEV OTP] Bypassed verification using dev master code (123456) for user ${userId}`);
  }

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });

  return true;
};

export const canResend = async (userId: string, purpose: OtpPurpose) => {
  const challenge = await prisma.otpChallenge.findFirst({
    where: { userId, purpose, consumedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  if (!challenge) return { allowed: true };

  const waitSeconds = Math.ceil((challenge.resendAvailableAt.getTime() - new Date().getTime()) / 1000);
  
  if (waitSeconds > 0) {
    return { allowed: false, waitSeconds };
  }

  return { allowed: true };
};
