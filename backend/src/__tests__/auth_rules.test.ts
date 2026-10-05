import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma';
import { createChallenge, verifyChallenge, canResend } from '../services/otp.service';
import { requestLoginOtp, verifyLoginOtp } from '../services/auth.service';
import { OtpPurpose, OtpChannel } from '@prisma/client';
import { hashPassword } from '../utils/otp';
import { verifyToken } from '../utils/jwt';

describe('Risky Logic: OTP Rules and Authentication Constraints', () => {
  const testUserEmail = `test_auth_${Date.now()}@livora.test`;
  let verifiedUserId: string;
  let unverifiedUserId: string;

  beforeAll(async () => {
    // Create a verified user for tests
    const verifiedUser = await prisma.user.create({
      data: {
        email: testUserEmail,
        passwordHash: await hashPassword('Test@Password123'),
        emailVerifiedAt: new Date(),
        name: 'Test Verified User',
        phone: '9876543210',
      },
    });
    verifiedUserId = verifiedUser.id;

    // Create an unverified user for login rule tests
    const unverifiedUser = await prisma.user.create({
      data: {
        email: `unverified_${Date.now()}@livora.test`,
        passwordHash: await hashPassword('Test@Password123'),
        emailVerifiedAt: null,
      },
    });
    unverifiedUserId = unverifiedUser.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: { in: [testUserEmail, `unverified_${Date.now()}@livora.test`] },
      },
    });
    await prisma.$disconnect();
  });

  describe('1. OTP Generation', () => {
    it('generates a 6-digit numeric OTP and stores the hashed representation', async () => {
      const code = await createChallenge(verifiedUserId, OtpPurpose.LOGIN);
      expect(code).toMatch(/^\d{6}$/);

      const challenge = await prisma.otpChallenge.findFirst({
        where: { userId: verifiedUserId, purpose: OtpPurpose.LOGIN, consumedAt: null },
        orderBy: { createdAt: 'desc' },
      });

      expect(challenge).toBeDefined();
      expect(challenge?.codeHash).toBeDefined();
      expect(challenge?.codeHash).not.toBe(code); // Hash must not equal plain code
      expect(challenge?.maxAttempts).toBe(5);
    });
  });

  describe('2. OTP Expiry Rule', () => {
    it('rejects an expired OTP code', async () => {
      // Create a challenge directly in DB with past expiry date
      const pastDate = new Date(Date.now() - 1000 * 60 * 15); // 15 mins ago
      await prisma.otpChallenge.create({
        data: {
          userId: verifiedUserId,
          channel: OtpChannel.EMAIL,
          purpose: OtpPurpose.LOGIN,
          codeHash: 'fake_hash_expired',
          expiresAt: pastDate,
          resendAvailableAt: pastDate,
          maxAttempts: 5,
        },
      });

      await expect(
        verifyChallenge(verifiedUserId, OtpPurpose.LOGIN, '123456')
      ).rejects.toThrow('OTP expired');
    });
  });

  describe('3. Attempt Limits Rule', () => {
    it('enforces maximum 5 attempts and locks out further attempts', async () => {
      // Create challenge with fresh code
      await createChallenge(verifiedUserId, OtpPurpose.EMAIL_VERIFICATION);

      const challenge = await prisma.otpChallenge.findFirst({
        where: { userId: verifiedUserId, purpose: OtpPurpose.EMAIL_VERIFICATION, consumedAt: null },
        orderBy: { createdAt: 'desc' },
      });

      // Set attempts to 5 (maximum reached)
      await prisma.otpChallenge.update({
        where: { id: challenge!.id },
        data: { attempts: 5 },
      });

      await expect(
        verifyChallenge(verifiedUserId, OtpPurpose.EMAIL_VERIFICATION, '000000')
      ).rejects.toThrow('Too many attempts');
    });
  });

  describe('4. Single-Use (Consumed) Rule', () => {
    it('marks OTP as consumed upon successful verification and disallows reuse', async () => {
      // Clean up previous unconsumed challenges for verified user
      await prisma.otpChallenge.deleteMany({
        where: { userId: verifiedUserId },
      });

      const code = await createChallenge(verifiedUserId, OtpPurpose.LOGIN);

      const isValid = await verifyChallenge(verifiedUserId, OtpPurpose.LOGIN, code);
      expect(isValid).toBe(true);

      // Verifying again should fail because the code is already consumed
      await expect(
        verifyChallenge(verifiedUserId, OtpPurpose.LOGIN, code)
      ).rejects.toThrow('No active OTP found');
    });
  });

  describe('5. Resend Cooldown Rule', () => {
    it('enforces 30-second cooldown period before allowing another OTP', async () => {
      await createChallenge(verifiedUserId, OtpPurpose.LOGIN);

      const resendCheck = await canResend(verifiedUserId, OtpPurpose.LOGIN);
      expect(resendCheck.allowed).toBe(false);
      expect(resendCheck.waitSeconds).toBeGreaterThan(0);
      expect(resendCheck.waitSeconds).toBeLessThanOrEqual(30);
    });
  });

  describe('6. Login Rules', () => {
    it('blocks unverified users from requesting a login OTP', async () => {
      const unverifiedUser = await prisma.user.findUnique({
        where: { id: unverifiedUserId },
      });

      await expect(
        requestLoginOtp({ email: unverifiedUser!.email })
      ).rejects.toThrow('Email not verified. Please verify your email first.');
    });

    it('rejects login request for non-existent email', async () => {
      await expect(
        requestLoginOtp({ email: 'nonexistent_account_12345@livora.test' })
      ).rejects.toThrow('No account found with this email');
    });

    it('allows verified users to log in with valid OTP and issues valid JWT token', async () => {
      const code = await createChallenge(verifiedUserId, OtpPurpose.LOGIN);

      const result = await verifyLoginOtp({
        email: testUserEmail,
        otp: code,
      });

      expect(result.token).toBeDefined();
      expect(result.user.id).toBe(verifiedUserId);
      expect(result.user.isVerified).toBe(true);

      // Verify the JWT token signature and payload
      const decoded = verifyToken(result.token);
      expect(decoded.userId).toBe(verifiedUserId);
    });
  });
});
