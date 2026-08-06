import crypto from 'crypto';

export function createVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

export function createState() {
  return crypto.randomBytes(16).toString('base64url');
}

export function createChallenge(verifier) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export function safeCompare(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
