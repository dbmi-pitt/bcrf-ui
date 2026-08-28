import { popReturnTo, safeCompare } from '@/lib/auth/pkce';
import { createSession } from '@/lib/auth/session';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWKS = createRemoteJWKSet(new URL('https://auth.globus.org/jwk.json'));
const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    const store = await cookies();
    store.delete('globus_oauth_state');
    store.delete('globus_pkce_verifier');
    store.delete('globus_return_to');
    return NextResponse.redirect(new URL(`/login`, BASE_URL));
  }

  const store = await cookies();
  const expectedState = store.get('globus_oauth_state')?.value;
  const verifier = store.get('globus_pkce_verifier')?.value;
  store.delete('globus_oauth_state');
  store.delete('globus_pkce_verifier');

  if (
    !code ||
    !state ||
    !expectedState ||
    !safeCompare(state, expectedState) ||
    !verifier
  ) {
    store.delete('globus_return_to');
    return NextResponse.redirect(new URL('/login', BASE_URL));
  }

  // Exchange code for tokens
  const clientId = process.env.GLOBUS_CLIENT_ID;
  const clientSecret = process.env.GLOBUS_CLIENT_SECRET;
  const tokenRes = await fetch('https://auth.globus.org/v2/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.GLOBUS_REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/login', BASE_URL));
  }

  // Format
  // tokenData: access_token, expires_in, refresh_token?, id_token, scope,
  // resource_server, other_tokens: [{ access_token, resource_server, scope, ... }]
  const tokenData = await tokenRes.json();

  const { payload: idClaims } = await jwtVerify(tokenData.id_token, JWKS, {
    issuer: 'https://auth.globus.org',
    audience: clientId,
  });

  const otherTokens = {};
  for (const t of tokenData.other_tokens ?? []) {
    otherTokens[t.resource_server] = t;
  }

  await createSession({
    sub: idClaims.sub,
    username: idClaims.preferred_username,
    name: idClaims.name,
    email: idClaims.email,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Date.now() + tokenData.expires_in * 1000,
    identitySet: idClaims.identities_set,
    otherTokens: otherTokens,
  });

  const returnTo = await popReturnTo('/sources');

  return NextResponse.redirect(new URL(returnTo, BASE_URL));
}
