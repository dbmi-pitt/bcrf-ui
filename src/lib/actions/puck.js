'use server';

import log from 'xac-loglevel';
import { getConnection } from '../data/database-puck.js';
import { getCurrentUser } from './auth.js';
import { requireSession } from './index.js';
import { getPerms } from './perms.js';

export const getPuckData = async (sourceId) => {
  await requireSession();

  try {
    const conn = await getConnection();
    const result = await conn.run(
      'SELECT data FROM puckdata WHERE source = $s',
      { s: sourceId },
    );
    const rows = await result.getRowObjectsJson();
    return { data: rows[0].data };
  } catch (error) {
    const rows = [];
    log.error(`Error querying puckdata for ${sourceId}:`, error);
    return { data: rows };
  }
};

export const savePuckData = async (sourceId, data) => {
  const currentUser = await getCurrentUser();
  const permSet = await getPerms(sourceId, currentUser.username);
  if (!permSet.data.includes('ADMIN') && !permSet.data.includes('ABOUT-EDIT')) {
    log.error(
      `User ${currentUser.username} does not have permission to save puckdata for ${sourceId}`,
    );
    return { success: false, error: 'User does not have permission' };
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
