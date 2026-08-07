'use server';

import { getSession } from '@/lib/globus/session';

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
