import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateOtp = async () => {
  const code = crypto.randomInt(100000, 999999).toString();
  const hash = await bcrypt.hash(code, 12);
  return { code, hash };
};

export const verifyOtp = async (code: string, hash: string) => {
  return bcrypt.compare(code, hash);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
