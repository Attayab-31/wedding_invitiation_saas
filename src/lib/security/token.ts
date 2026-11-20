import crypto from 'crypto';

/**
 * Generates a cryptographically secure token with at least 128 bits of entropy.
 * Uses 24 random bytes (192 bits of entropy) in base64url format.
 */
export function generateGuestToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

/**
 * Hashes a raw bearer invitation token using SHA-256 for secure database lookup.
 */
export function hashGuestToken(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Constant-time comparison to prevent timing attacks.
 */
export function timingSafeEqualHash(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
