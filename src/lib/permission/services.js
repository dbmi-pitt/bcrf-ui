import { getCurrentUser } from '@/lib/auth/services';
import { getConnection } from '@/lib/data/database-puck';
import { GLOBAL_SOURCE, PERMISSION } from '@/lib/permission/constants';
import 'server-only';
import log from 'xac-loglevel';

export const getCurrentUserPermissions = async (sourceId) => {
  const { username } = await getCurrentUser();

  try {
    const conn = await getConnection();

    const result = await conn.run(
      `
      SELECT DISTINCT
          p.key,
          p.description
      FROM group_membership gm
      JOIN groups g
          ON g.uuid = gm.group_uuid
      JOIN group_grants gg
          ON gg.group_uuid = g.uuid
      JOIN permissions p
          ON p.key = gg.permission_key
      WHERE gm.user_email = $email
        AND (
              g.source = $source
              OR g.source = $globalSource
            )
      ORDER BY p.key;
      `,
      { source: sourceId, email: username, globalSource: GLOBAL_SOURCE },
    );
    const rows = await result.getRows();
    return rows.map((n) => n[0]);
  } catch (error) {
    const rows = [];
    log.error(
      `Error querying puckdata / permissons for ${sourceId} ${username}:`,
      error,
    );
    return rows;
  }
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
