'use server';

import {
  createChallenge,
  createState,
  createVerifier,
  safeRedirectPath,
} from '@/lib/auth/pkce';
import { deleteSession, getSession } from '@/lib/auth/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logInWithGlobus(formData) {
  const verifier = createVerifier();
  const challenge = createChallenge(verifier);
  const state = createState();

  // Get the from field from the form data, if present.
  const rawReturnTo =
    formData instanceof FormData ? formData.get('from') : null;
  const safeReturnTo = safeRedirectPath(rawReturnTo, '/');

  const store = await cookies();
  // short-lived httpOnly cookies used only to validate the callback
  store.set('globus_pkce_verifier', verifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });
  store.set('globus_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });
  store.set('globus_return_to', safeReturnTo, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
  });

  const url = new URL('https://auth.globus.org/v2/oauth2/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', process.env.GLOBUS_CLIENT_ID);
  url.searchParams.set('redirect_uri', process.env.GLOBUS_REDIRECT_URI);
  url.searchParams.set('scope', process.env.GLOBUS_SCOPES);
  url.searchParams.set('state', state);
  url.searchParams.set('prompt', 'login');
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  redirect(url.toString());
}

export async function logOutOfGlobus() {
  const session = await getSession();
  if (session?.accessToken) {
    const clientId = process.env.GLOBUS_CLIENT_ID;
    const clientSecret = process.env.GLOBUS_CLIENT_SECRET;

    // try to revoke the access token but don't fail if it doesn't work
    await fetch('https://auth.globus.org/v2/oauth2/token/revoke', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ token: session.accessToken }),
    }).catch(() => {});
  }
  await deleteSession();
  redirect('/');
}
