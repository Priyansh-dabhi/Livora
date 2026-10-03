import { describe, it, expect } from 'vitest';
import { generateOtp, verifyOtp } from '../utils/otp';

describe('OTP Utility', () => {
  it('generates a 6-digit OTP and its hash', async () => {
    const { code, hash } = await generateOtp();
    expect(code).toMatch(/^\d{6}$/);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(code);
  });

  it('verifies a correct OTP', async () => {
    const { code, hash } = await generateOtp();
    const isValid = await verifyOtp(code, hash);
    expect(isValid).toBe(true);
  });

  it('rejects an incorrect OTP', async () => {
    let { code, hash } = await generateOtp();
    // Use an incorrect code ensuring it's different
    const wrongCode = code === '000000' ? '111111' : '000000';
    const isValid = await verifyOtp(wrongCode, hash);
    expect(isValid).toBe(false);
  });
});
