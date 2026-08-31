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
      SELECT permission_set
      FROM group_grants
      WHERE gid = 'G0'
      UNION
      SELECT permission_set
      FROM group_grants gg
      JOIN group_membership gm
        ON gg.gid = gm.gid
        AND gg.source = gm.source
      WHERE gg.source = $source
        AND gm.email = $email
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
    permissionSet.includes('ADMIN') ||
    required.some((perm) => permissionSet.includes(perm))
  );
};

/**
 * Checks whether a user is in the `users` table.
 *
 * @async
 * @function hasGlobusReadPermission
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} `true` if the user has the permission,
 *   `false` if they don't, the email is invalid, or a query error occurs.
 */
export const hasGlobusReadPermission = async (email) => {
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
    log.error(`Error checking Globus read permission for ${email}:`, error);
    return false;
  }
};
