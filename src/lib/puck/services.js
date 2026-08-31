import { getConnection } from '@/lib/data/database-puck.js';
import { getSummaryDataSource } from '@/lib/sources/services.js';
import 'server-only';
import log from 'xac-loglevel';

export const getPuckData = async (sourceId) => {
  const conn = await getConnection();
  const result = await conn.run('SELECT data FROM puckdata WHERE source = $s', {
    s: sourceId,
  });
  const rows = await result.getRowObjectsJson();
  if (rows.length === 0) {
    log.debug(`No puckdata found for ${sourceId}, returning default`);
    return await getDefaultPuckData(sourceId);
  }

  return JSON.parse(rows[0].data);
};

const getDefaultPuckData = async (sourceId) => {
  const summary = await getSummaryDataSource(sourceId);
  if (!summary) {
    return null;
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
          heading: name,
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
