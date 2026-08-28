import { getSession } from '@/lib/auth/session';
import 'server-only';

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
