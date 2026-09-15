import { buildSelectClause, resolveColumns } from '@/lib/database/utils';
import { getDatabasePool } from '@/lib/db';
import 'server-only';

// Whitelist of columns that are actually allowed to be selected.
// This must match the real `users` table columns exactly.
const ALLOWED_USER_COLUMNS = [
  'email',
  'uuid',
  'name',
  'organization',
  'created_at',
  'updated_at',
];

const DEFAULT_USER_COLUMNS = ALLOWED_USER_COLUMNS;

/**
 * Get all users.
 *
 * @param {string[]} [columns] - subset of ALLOWED_USER_COLUMNS to return.
 *                                Defaults to all columns if omitted.
 *
 * @returns {Promise<Object[]>} - array of user objects with the requested columns.
 */
export async function getUsers(columns) {
  const pool = getDatabasePool();
  const selectedColumns = resolveColumns(
    columns,
    ALLOWED_USER_COLUMNS,
    DEFAULT_USER_COLUMNS,
  );
  const selectClause = buildSelectClause(pool, selectedColumns);

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM users ORDER BY name`,
  );
  return rows;
}

/**
 * Get a single user by their email.
 *
 * @param {string} email - the email of the user.
 * @param {string[]} [columns] - subset of ALLOWED_USER_COLUMNS to return.
 *
 * @returns {Promise<Object|null>} - user object if found, otherwise null.
 */
export async function getUserByEmail(email, columns) {
  const pool = getDatabasePool();
  const selectedColumns = resolveColumns(
    columns,
    ALLOWED_USER_COLUMNS,
    DEFAULT_USER_COLUMNS,
  );
  const selectClause = buildSelectClause(pool, selectedColumns);

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM users WHERE email = ? LIMIT 1`,
    [email],
  );

  return rows[0] ?? null;
}
