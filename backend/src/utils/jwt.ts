import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwt.secret) as { userId: string };
};
