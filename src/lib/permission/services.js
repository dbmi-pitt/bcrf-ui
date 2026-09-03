import { getCurrentUser } from '@/lib/auth/services.js';
import { getConnection } from '@/lib/data/database-puck.js';
import 'server-only';
import log from 'xac-loglevel';

export const getPerms = async (sourceId) => {
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
              OR g.source = 'bcrf-global'
            )
      ORDER BY p.key;
      `,
      { source: sourceId, email: username },
    );
    const rows = await result.getRows();
    return {
      data: rows.map((n) => {
        return n[0];
      }),
    };
  } catch (error) {
    const rows = [];
    log.error(
      `Error querying puckdata / permissons for ${sourceId} ${username}:`,
      error,
    );
    return { data: rows };
  }
};

export const hasPermission = async (sourceId, requiredPerms) => {
  const { data: permissionSet } = await getPerms(sourceId);
  const required = Array.isArray(requiredPerms)
    ? requiredPerms
    : [requiredPerms];

  return (
    permissionSet.includes('SOURCE_ADMIN') ||
    permissionSet.includes('SUPER_ADMIN') ||
    required.some((perm) => permissionSet.includes(perm))
  );
};

/**
 * Checks whether a user has global read permission.
 *
 * @async
 * @function hasGlobalReadPermission
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} `true` if the user has the permission,
 *   `false` if they don't, the email is invalid, or a query error occurs.
 */
export const hasGlobalReadPermission = async (email) => {
  try {
    const conn = await getConnection();

    const result = await conn.run(
      `SELECT EXISTS (
        SELECT 1 FROM users WHERE email = $email
      ) AS hasPermission;`,
      { email: email },
    );
    const rows = await result.getRowObjects();
    return rows[0]?.hasPermission === true;
  } catch (error) {
    log.error(`Error checking global read permission for ${email}:`, error);
    return false;
  }
};
