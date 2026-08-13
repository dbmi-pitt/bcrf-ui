'use server';

import log from 'xac-loglevel';
import { getConnection } from '../data/database-puck.js';
import { getCurrentUser } from './auth.js';

export const getPerms = async (sourceId) => {
  const { username } = await getCurrentUser();

  try {
    const conn = await getConnection();

    const result = await conn.run(
      `
      select permission_set from group_grants where gid='G0'
      UNION select permission_set from group_grants gg join group_membership gm
      on (gg.gid=gm.gid and gg.source=gm.source)
      where gg.source = $source and gm.email = $email
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
