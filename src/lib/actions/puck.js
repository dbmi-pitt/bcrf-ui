'use server';

import { getConnection } from '../data/database-puck.js';
import log from 'xac-loglevel';
import { requireSession } from './index.js';

export const getPuckData = async (sourceId) => {
  await requireSession();

   try {
      const conn = await getConnection();
      const result = await conn.run("SELECT data FROM puckdata WHERE source=$s", {'s':sourceId});
      const rows = await result.getRowObjectsJson(); 
      return {data: rows[0].data}
    } catch (error) {
      const rows = [];
      log.error(`Error querying puckdata for ${sourceId}:`, error);
      return {data: rows}
    }
    
};

