import crypto from 'crypto';
import log from 'xac-loglevel';

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

export function safeRedirectPath(path, fallback = '/') {
  if (typeof path !== 'string' || path.length === 0 || path.length > 2048) {
    return fallback;
  }

  // Must start with exactly one '/', never '//' or '/\'
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.startsWith('/\\')
  ) {
    return fallback;
  }

  // Reject control characters or an embedded scheme.
  if (
    /[\x00-\x1f\x7f]/.test(path) ||
    /^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)
  ) {
    return fallback;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL.replace(/\/$/, '');

  try {
    // Confirm it resolves to the same origin
    const resolved = new URL(path, baseUrl);
    if (resolved.origin !== baseUrl) {
      return fallback;
    }

    // Rebuild the path to ensure it doesn't contain any unexpected characters
    return resolved.pathname + resolved.search + resolved.hash;
  } catch (error) {
    log.error('Error resolving redirect path:', error);
    return fallback;
  }
}
