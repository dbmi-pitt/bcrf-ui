import { createHash } from 'crypto';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';
import 'server-only';

let sessionKey;

function getSessionKey() {
  if (sessionKey) {
    return sessionKey;
  }

  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  sessionKey = createHash('sha256').update(secret).digest();

  return sessionKey;
}

export const COOKIE_NAME = 'globus_session';

export async function createSession(session) {
  const jwe = await new EncryptJWT({ ...session })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .encrypt(getSessionKey());

  const store = await cookies();

  store.set(COOKIE_NAME, jwe, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function decryptSessionToken(raw) {
  if (!raw) {
    return null;
  }

  try {
    const { payload } = await jwtDecrypt(raw, getSessionKey());
    return payload;
  } catch {
    return null;
  }
}

export const getSession = cache(async function getSession() {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;

  return decryptSessionToken(raw);
});
