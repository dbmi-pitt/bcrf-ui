import { getDatabasePool } from '@/lib/database/index';
import { buildSelectClause, resolveColumns } from '@/lib/database/utils';
import 'server-only';

// Whitelist of columns that are actually allowed to be selected.
// This must match the real 'sources' table columns exactly.
const ALLOWED_SOURCE_COLUMNS = [
  'source',
  'name',
  'description',
  'patient_count',
  'sample_count',
  'data_table_name',
  'key_column',
  'data_types',
  'virtual',
  'created_at',
  'updated_at',
];

const DEFAULT_SOURCE_COLUMNS = ALLOWED_SOURCE_COLUMNS;

/**
 * Get all sources.
 *
 * @param {string[]} [columns] - subset of ALLOWED_SOURCE_COLUMNS to return.
 *                                Defaults to all columns if omitted.
 *
 * @returns {Promise<Object[]>} - an array of source objects.
 */
export async function getSources(columns) {
  const pool = getDatabasePool();
  const selectedColumns = resolveColumns(
    columns,
    ALLOWED_SOURCE_COLUMNS,
    DEFAULT_SOURCE_COLUMNS,
  );
  const selectClause = buildSelectClause(pool, selectedColumns);

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM sources
     WHERE \`virtual\` = false`,
  );
  return rows;
}

/**
 * Get a single source by its 'source' identifier.
 *
 * @param {string} sourceId - the 'source' primary key value.
 * @param {string[]} [columns] - subset of ALLOWED_SOURCE_COLUMNS to return.
 *                                Defaults to all columns if omitted.
 *
 * @returns {Promise<Object|null>} - the source object if found, otherwise null.
 */
export async function getSource(sourceId, columns) {
  const pool = getDatabasePool();
  const selectedColumns = resolveColumns(
    columns,
    ALLOWED_SOURCE_COLUMNS,
    DEFAULT_SOURCE_COLUMNS,
  );
  const selectClause = buildSelectClause(pool, selectedColumns);

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM sources
     WHERE source = ? AND \`virtual\` = false
     LIMIT 1`,
    [sourceId],
  );

  return rows[0] ?? null;
}
