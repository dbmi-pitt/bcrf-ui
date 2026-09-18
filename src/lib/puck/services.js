import { getPuckData as getPuckDataFromDb } from '@/lib/database/puckdata.js';
import { getSummaryDataSource } from '@/lib/sources/services.js';
import 'server-only';
import log from 'xac-loglevel';

/**
 * Get the puck data for a given source.
 *
 * @param {string} source - the source identifier.
 *
 * @returns {Promise<Object>}
 */
export const getPuckData = async (source) => {
  const puckDataFromDb = await getPuckDataFromDb(source);
  if (!puckDataFromDb) {
    log.debug(`No puckdata found for ${source}, returning default`);
    return await getDefaultPuckData(source);
  }
  return puckDataFromDb;
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
