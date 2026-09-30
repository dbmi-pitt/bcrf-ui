import {
  getUserByEmail as getUserByEmailFromDb,
  getUsers as getUsersFromDb,
} from '@/lib/database/users';
import 'server-only';

/**
 * @typedef {Object} User
 * @property {string} uuid - Unique identifier for the user.
 * @property {string} email - The user's email address.
 * @property {string} name - The user's display name.
 * @property {string} [organization] - The user's organization, if set.
 */

/**
 * Retrieve all users from the database.
 *
 * @returns {Promise<User[]>}
 */
export const getUsers = async () => {
  return getUsersFromDb(['uuid', 'name', 'email', 'organization']);
};

/**
 * Retrieve a single user by their email address.
 *
 * @param {string} email - The email address to look up
 *
 * @returns {Promise<User | null>}
 */
export const getUserByEmail = async (email) => {
  return getUserByEmailFromDb(email, ['uuid', 'name', 'email', 'organization']);
};
