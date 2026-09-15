import { getDatabasePool } from '@/lib/database/index';
import { GLOBAL_SOURCE, PERMISSION } from '@/lib/permission/constants';
import 'server-only';

/**
 * Get the set of permission keys a user has for a given source.
 *
 * @param {string} userEmail - the email of the user.
 * @param {string} source - the source identifier.
 *
 * @returns {Promise<string[]>}
 */
export async function getPermissionsForUserAndSource(userEmail, source) {
  const pool = getDatabasePool();

  const [rows] = await pool.query(
    `SELECT DISTINCT gg.permission_key
     FROM group_membership gm
     JOIN groups g ON g.uuid = gm.group_uuid
     JOIN group_grants gg ON gg.group_uuid = g.uuid
     WHERE gm.user_email = ?
       AND (g.source = ? OR g.source = ?)`,
    [userEmail, source, GLOBAL_SOURCE],
  );

  return rows.map((row) => row.permission_key);
}

/**
 * Check whether a user has READ permission to read all sources.
 *
 * @param {string} userEmail - the email of the user.
 *
 * @returns {Promise<boolean>}
 */
export async function hasGlobalReadPermission(userEmail) {
  const pool = getDatabasePool();

  const [rows] = await pool.query(
    `SELECT 1
     FROM group_membership gm
     JOIN groups g ON g.uuid = gm.group_uuid
     JOIN group_grants gg ON gg.group_uuid = g.uuid
     WHERE gm.user_email = ?
       AND g.source = ?
       AND gg.permission_key = ?
     LIMIT 1`,
    [userEmail, GLOBAL_SOURCE, PERMISSION.READ],
  );

  return rows.length > 0;
}

/**
 * Check whether a user has SUPER_ADMIN permission, administrative access to the
 * entire system.
 *
 * @param {string} userEmail - the email of the user.
 *
 * @returns {Promise<boolean>}
 */
export async function hasSuperAdminPermission(userEmail) {
  const pool = getDatabasePool();

  const [rows] = await pool.query(
    `SELECT 1
     FROM group_membership gm
     JOIN groups g ON g.uuid = gm.group_uuid
     JOIN group_grants gg ON gg.group_uuid = g.uuid
     WHERE gm.user_email = ?
       AND g.source = ?
       AND gg.permission_key = ?
     LIMIT 1`,
    [userEmail, GLOBAL_SOURCE, PERMISSION.SUPER_ADMIN],
  );

  return rows.length > 0;
}
