'use server';

import { updatePuckData as updatePuckDataInDb } from '@/lib/database/puckdata';
import { PERMISSION } from '@/lib/permission/constants';
import { hasCurrentUserPermission } from '@/lib/permission/services';
import log from 'xac-loglevel';

/**
 * Update the puck data for a given source.
 *
 * @param {string} sourceId - the source identifier.
 * @param {Object} data - the data to update.
 *
 * @returns {Promise<{ success: boolean, error?: string }>} - the result of the update operation.
 */
export const updatePuckData = async (sourceId, data) => {
  const authorized = await hasCurrentUserPermission(
    sourceId,
    PERMISSION.ABOUT_WRITE,
  );
  if (!authorized) {
    log.error(`User does not have permission to save puckdata for ${sourceId}`);
    return { success: false, error: 'User does not have permission to edit' };
  }

  try {
    const result = await updatePuckDataInDb(sourceId, data);
    if (result < 1) {
      throw new Error(`No rows updated for puckdata with sourceId ${sourceId}`);
    }
    return { success: true };
  } catch (error) {
    log.error(`Error updating puckdata for ${sourceId}:`, error);
    return { success: false, error: 'Error while updating configuration' };
  }
};
