'use server';

import { GLOBAL_SOURCE, PERMISSION } from '@/lib/permission/constants';
import { hasCurrentUserPermission } from '@/lib/permission/services';

/**
 * Checks whether the currently authenticated user has global read permission.
 *
 * @returns {Promise<boolean>} whether the user has global read permission.
 */
export const hasCurrentUserGlobalReadPermission = async () => {
  return hasCurrentUserPermission(GLOBAL_SOURCE, PERMISSION.READ);
};
