import { getConnection } from '@/lib/data/database-puck.js';
import 'server-only';

/**
 * Retrieves all users from the database.
 *
 * @async
 * @function getUsers
 * @returns {Promise<Array<{uuid: string, name: string, email: string, organization: string}>>}
 */
export const getUsers = async () => {
  const conn = await getConnection();

  const reader = await conn.runAndReadAll(
    'SELECT uuid, name, email, organization FROM users',
  );
  const rows = reader.getRowObjects();
  return rows;
};

/**
 * Retrieves a single user by their email address.
 *
 * @async
 * @function getUserByEmail
 * @param {string} email - The email address to look up. Must be a
 *   non-empty string.
 * @returns {Promise<{uuid: string, email: string, name: string, organization: string} | null>}
 */
export const getUserByEmail = async (email) => {
  const conn = await getConnection();

  const reader = await conn.runAndReadAll(
    'SELECT uuid, email, name, organization FROM users WHERE email = $email',
    { $email: email },
  );
  const rows = reader.getRowObjects();
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};
