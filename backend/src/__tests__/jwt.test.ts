import { describe, it, expect } from 'vitest';
import { generateToken, verifyToken } from '../utils/jwt';

describe('JWT Utility', () => {
  it('generates a valid JWT token', () => {
    const token = generateToken('user-123');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('verifies a valid token', () => {
    const token = generateToken('user-123');
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe('user-123');
  });

  it('throws on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });
});
