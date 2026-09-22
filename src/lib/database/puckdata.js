import { getDatabasePool } from '@/lib/database/index';
import 'server-only';

/**
 * Get the set of permission keys a user has for a given source.
 *
 * @param {string} source - the source identifier.
 *
 * @returns {Promise<Object|null>}
 */
export async function getPuckData(source) {
  const pool = getDatabasePool();

  const [rows] = await pool.query(
    'SELECT data FROM puckdata WHERE source = ?',
    [source],
  );

  return rows.length > 0 ? rows[0].data : null;
}

/**
 * Update the puck data for a given source.
 *
 * @param {string} source - the source identifier.
 * @param {Object} data - the data to update.
 *
 * @returns {Promise<boolean>}
 */
export async function updatePuckData(source, data) {
  const pool = getDatabasePool();

  const [result] = await pool.query(
    `INSERT INTO puckdata (source, data)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE data = ?`,
    [source, JSON.stringify(data), JSON.stringify(data)],
  );

  return result.affectedRows > 0;
}
