import { getSession } from '@/lib/auth/session';
import 'server-only';

/**
 * Retrieves the currently authenticated user based on the active session.
 *
 * @async
 * @function getCurrentUser
 * @returns {Promise<{sub: string, username: string, name: string, email: string} | null>}
 *   A promise that resolves to the current user's info, or `null` if no
 *   session is active.
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return {
    sub: session.sub,
    username: session.username,
    name: session.name,
    email: session.email,
  };
}
