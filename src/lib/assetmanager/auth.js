import { getCurrentUser } from '@/lib/auth/services';
import { PERMISSION } from '@/lib/permission/constants';
import { getCurrentUserPermissions } from '@/lib/permission/services';
import 'server-only';

export async function getUserSourcePerms(sourceId) {
  const currentUser = await getCurrentUser();
  const perms = await getCurrentUserPermissions(sourceId);
  return { id: currentUser.username, source: sourceId, perms };
}

/**
 * @param {{ id: string, perms: []string }} user
 */
export async function userCanUploadTo(user) {
  return (
    user.perms.includes(PERMISSION.SOURCE_ADMIN) ||
    user.perms.includes(PERMISSION.SUPER_ADMIN) ||
    user.perms.includes(PERMISSION.ASSETS_WRITE)
  );
}

/**
 * @param {{ id: string, perms: []string }} user
 * @param {{ is_public: 0 | 1, uploaded_by: string | null }} file
 */
export async function userCanView(user, file) {
  if (file.is_public) return true;
  return (
    user.perms.includes(PERMISSION.SOURCE_ADMIN) ||
    user.perms.includes(PERMISSION.SUPER_ADMIN) ||
    user.perms.includes(PERMISSION.ASSETS_WRITE)
  );
}

/**
 * @param {{ id: string, perms: []string }} user
 * @param {{ is_public: 0 | 1 }} source
 */
export async function userCanViewSource(user, source) {
  if (source.is_public) return true;
  return (
    user.perms.includes(PERMISSION.SOURCE_ADMIN) ||
    user.perms.includes(PERMISSION.SUPER_ADMIN) ||
    user.perms.includes(PERMISSION.ASSETS_WRITE)
  );
}
