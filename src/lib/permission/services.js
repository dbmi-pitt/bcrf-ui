import { getCurrentUser } from '@/lib/auth/services';
import { getPermissionsForUserAndSource } from '@/lib/database/permissions';
import { GLOBAL_SOURCE, PERMISSION } from '@/lib/permission/constants';
import 'server-only';

export const getCurrentUserPermissions = async (sourceId) => {
  const { username } = await getCurrentUser();
  return getPermissionsForUserAndSource(username, sourceId);
};

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

/**
 * Checks whether the currently authenticated user has global read permission.
 *
 * @async
 * @function hasCurrentUserGlobalReadPermission
 * @returns {Promise<boolean>} `true` if the user has the permission,
 *   `false` otherwise.
 */
export const hasCurrentUserGlobalReadPermission = async () => {
  return hasCurrentUserPermission(GLOBAL_SOURCE, PERMISSION.READ);
};
