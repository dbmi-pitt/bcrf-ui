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
