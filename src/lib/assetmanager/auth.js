'use server';
import { getCurrentUser } from '@/lib/auth/services';
import { getPerms } from '../permission/services';

export async function getUserSourcePerms(sourceId) {
  const currentUser = await getCurrentUser();
  const permSet = await getPerms(sourceId, currentUser.username);
  return { id: currentUser.username, source: sourceId, perms: permSet.data };
}

/**
 * @param {{ id: string, perms: []string }} user
 */
export async function userCanUploadTo(user) {
  return user.perms.includes('ADMIN') || user.perms.includes('ASSETS-WRITE');
}

/**
 * @param {{ id: string, perms: []string }} user
 * @param {{ is_public: 0 | 1, uploaded_by: string | null }} file
 */
export async function userCanView(user, file) {
  if (file.is_public) return true;
  return user.perms.includes('ADMIN') || user.perms.includes('ASSETS-WRITE');
}

/**
 * @param {{ id: string, perms: []string }} user
 * @param {{ is_public: 0 | 1 }} source
 */
export async function userCanViewSource(user, source) {
  if (source.is_public) return true;
  return user.perms.includes('ADMIN') || user.perms.includes('ASSETS-WRITE');
}
