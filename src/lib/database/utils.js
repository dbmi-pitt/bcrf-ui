import 'server-only';

/**
 * Validates and normalizes a requested list of columns against a list of
 * allowed values.
 *
 * @param {string[]|undefined} requestedColumns - list of columns requested
 * @param {string[]} allowedColumns - list of valid column names
 * @param {string[]} defaultColumns - columns to use when none are requested
 *
 * @returns {string[]}
 */
export function resolveColumns(
  requestedColumns,
  allowedColumns,
  defaultColumns,
) {
  if (!requestedColumns || requestedColumns.length === 0) {
    return defaultColumns;
  }

  const unique = [...new Set(requestedColumns)];
  const invalid = unique.filter((col) => !allowedColumns.includes(col));
  if (invalid.length > 0) {
    throw new Error(`Invalid column(s) requested: ${invalid.join(', ')}`);
  }

  return unique;
}

/**
 * Builds a `SELECT col1, col2` clause safely.
 *
 * @param {import('mysql2/promise').Pool} pool - MySQL connection pool
 * @param {string[]} columns - list of columns requested
 *
 * @returns {string}
 */
export function buildSelectClause(pool, columns) {
  return columns.map((col) => pool.escapeId(col)).join(', ');
}

/**
 * Escapes SQL LIKE wildcard characters for queries using ESCAPE '\\'.
 *
 * @param {string} value
 * @returns {string}
 */
export function escapeLike(value) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}
