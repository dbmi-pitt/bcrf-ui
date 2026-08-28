'use server';

import { getCurrentUser } from '@/lib/auth/services.js';
import { getConnection } from '@/lib/data/database-puck.js';
import { hasPermission } from '@/lib/permission/services.js';
import log from 'xac-loglevel';

export const savePuckData = async (sourceId, data) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    log.error(`User not authenticated, cannot save puckdata for ${sourceId}`);
    return { success: false, error: 'User not authenticated' };
  }
  const authorized = await hasPermission(sourceId, 'ABOUT-EDIT');
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
