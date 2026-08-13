'use server';

import log from 'xac-loglevel';
import { getConnection } from '../data/database-puck.js';
import { getCurrentUser } from './auth.js';
import { requireSession } from './index.js';
import { getPerms } from './perms.js';
import { getSummaryDataSource } from './sources.js';

export const getPuckData = async (sourceId) => {
  await requireSession();

  try {
    const conn = await getConnection();
    const result = await conn.run(
      'SELECT data FROM puckdata WHERE source = $s',
      { s: sourceId },
    );
    const rows = await result.getRowObjectsJson();
    if (rows.length === 0) {
      log.debug(`No puckdata found for ${sourceId}, returning default`);
      return { data: await getDefaultPuckData(sourceId) };
    }

    return { data: JSON.parse(rows[0].data) };
  } catch (error) {
    log.error(`Error querying puckdata for ${sourceId}:`, error);
    throw new Error(`Error getting puckdata for source ${sourceId}`);
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

const getDefaultPuckData = async (sourceId) => {
  const summary = await getSummaryDataSource(sourceId);
  if (summary.notFound) {
    return { notFound: true };
  }
  const { name, description } = summary;

  return {
    root: { props: {} },
    content: [
      {
        type: 'HeadingBlock',
        props: {
          id: 'HeadingBlock-0fdd677d-5209-47f3-b122-16ee9e6d5694',
          children: name,
        },
      },
      {
        type: 'Text',
        props: {
          content: `<p>${description}</p>`,
          id: 'Text-84c92738-526b-48b4-aa2e-f6542d670460',
        },
      },
    ],
    zones: {},
  };
};
