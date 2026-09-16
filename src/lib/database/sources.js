import { getDatabasePool } from '@/lib/database/index';
import { buildSelectClause, resolveColumns } from '@/lib/database/utils';
import 'server-only';

// Whitelist of columns that are actually allowed to be selected.
// This must match the real 'sources' table columns exactly.
const ALLOWED_SOURCE_COLUMNS = [
  'source',
  'name',
  'description',
  'terms_of_use',
  'patient_count',
  'sample_count',
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

/**
 * Get sources matching a set of 'source' identifiers.
 *
 * @param {string[]} sourceIds - the 'source' primary key values to fetch.
 * @param {string[]} [columns] - subset of ALLOWED_SOURCE_COLUMNS to return.
 *                                Defaults to all columns if omitted.
 * @param {string} [orderBy] - column to sort results by. Must be one of
 *                              ALLOWED_SOURCE_COLUMNS. Defaults to 'name'.
 *
 * @returns {Promise<Object[]>} - an array of source objects.
 */
export async function getSourcesByIds(sourceIds, columns, orderBy = 'name') {
  if (!sourceIds || sourceIds.length === 0) {
    return [];
  }

  if (!ALLOWED_SOURCE_COLUMNS.includes(orderBy)) {
    throw new Error(`Invalid orderBy column requested: ${orderBy}`);
  }

  const pool = getDatabasePool();
  const selectedColumns = resolveColumns(
    columns,
    ALLOWED_SOURCE_COLUMNS,
    DEFAULT_SOURCE_COLUMNS,
  );
  const selectClause = buildSelectClause(pool, selectedColumns);
  const orderByClause = pool.escapeId(orderBy);

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM sources
     WHERE source IN (?) AND \`virtual\` = false
     ORDER BY ${orderByClause} ASC`,
    [sourceIds],
  );
  return rows;
}
