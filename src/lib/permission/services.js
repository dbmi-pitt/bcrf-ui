import { getCurrentUser } from '@/lib/auth/services';
import { getPermissionsForUserAndSource } from '@/lib/database/permissions';
import { PERMISSION } from '@/lib/permission/constants';
import 'server-only';

/**
 * Gets the current user's permissions for a source.
 *
 * @param {string} sourceId
 *
 * @returns {Promise<string[]>}
 */
export const getCurrentUserPermissions = async (sourceId) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return [];
  }

  const { username } = currentUser;
  return getPermissionsForUserAndSource(username, sourceId);
};

/**
 * Checks whether the current user has one of the requested permissions.
 *
 * @param {string} sourceId
 * @param {string|string[]} requiredPerms
 *
 * @returns {Promise<boolean>}
 */
export const hasCurrentUserPermission = async (sourceId, requiredPerms) => {
  const permissionSet = await getCurrentUserPermissions(sourceId);
  const required = Array.isArray(requiredPerms)
    ? requiredPerms
    : [requiredPerms];

  return (
    permissionSet.includes(PERMISSION.SOURCE_ADMIN) ||
    permissionSet.includes(PERMISSION.SUPER_ADMIN) ||
    required.some((perm) => permissionSet.includes(perm))
  );
};
