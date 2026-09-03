'use server';

import { getConnection } from '@/lib/data/database-puck';
import { PERMISSION } from '@/lib/permission/constants';
import { hasPermission } from '@/lib/permission/services';
import log from 'xac-loglevel';

export const savePuckData = async (sourceId, data) => {
  const authorized = await hasPermission(sourceId, PERMISSION.ABOUT_WRITE);
  if (!authorized) {
    log.error(
      `User ${currentUser.username} does not have permission to save puckdata for ${sourceId}`,
    );
    return { success: false, error: 'User does not have permission to edit' };
  }

  try {
    const conn = await getConnection();
    const jsonString = JSON.stringify(data);

    await conn.run(
      `
      INSERT INTO puckdata (source, data) VALUES ($s, $d)
      ON CONFLICT (source) DO UPDATE SET data = $d
      `,
      { s: sourceId, d: jsonString },
    );
    return { success: true };
  } catch (error) {
    log.error(`Error saving puckdata for ${sourceId}:`, error);
    return { success: false, error: 'Error while saving configuration' };
  }
};
