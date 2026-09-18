import { getDatabasePool } from '@/lib/database/index';
import {
  buildSelectClause,
  escapeLike,
  resolveColumns,
} from '@/lib/database/utils';
import { randomUUID } from 'crypto';
import 'server-only';

// Whitelist of columns that are actually allowed to be selected.
// This must match the real 'files' table columns exactly (00003-files.sql).
const ALLOWED_FILE_COLUMNS = [
  'id',
  'source',
  'path',
  'path_lower',
  'storage_key',
  'original_name',
  'mime_type',
  'size',
  'checksum',
  'uploaded_by',
  'public',
  'logically_del',
  'created_at',
  'updated_at',
];

const DEFAULT_FILE_COLUMNS = ALLOWED_FILE_COLUMNS;

/**
 * @typedef {Object} FileRecord
 * @property {string} id
 * @property {string} source
 * @property {string} path
 * @property {string} path_lower
 * @property {string} storage_key
 * @property {string} original_name
 * @property {string} mime_type
 * @property {number} size
 * @property {string} checksum
 * @property {string | null} uploaded_by
 * @property {0 | 1} public
 * @property {0 | 1} logically_del
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Get a single file by its (source, path_lower) key.
 *
 * @param {string} source
 * @param {string} pathLower - already-lowercased virtual path.
 * @param {{ columns?: string[], includeDeleted?: boolean }} [options]
 * @returns {Promise<FileRecord | null>}
 */
export async function getFileByPath(source, pathLower, options = {}) {
  const pool = getDatabasePool();
  const selectClause = buildSelectClause(
    pool,
    resolveColumns(options.columns, ALLOWED_FILE_COLUMNS, DEFAULT_FILE_COLUMNS),
  );

  const conditions = ['source = ?', 'path_lower = ?'];
  const params = [source, pathLower];
  if (!options.includeDeleted) {
    conditions.push('logically_del = false');
  }

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM files WHERE ${conditions.join(' AND ')} LIMIT 1`,
    params,
  );
  return rows[0] ?? null;
}

/**
 * Get a single file by its primary key.
 *
 * @param {string} id
 * @param {{ columns?: string[], includeDeleted?: boolean }} [options]
 * @returns {Promise<FileRecord | null>}
 */
export async function getFileById(id, options = {}) {
  const pool = getDatabasePool();
  const selectClause = buildSelectClause(
    pool,
    resolveColumns(options.columns, ALLOWED_FILE_COLUMNS, DEFAULT_FILE_COLUMNS),
  );

  const conditions = ['id = ?'];
  const params = [id];
  if (!options.includeDeleted) {
    conditions.push('logically_del = false');
  }

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM files WHERE ${conditions.join(' AND ')} LIMIT 1`,
    params,
  );
  return rows[0] ?? null;
}

/**
 * Get a single file by its storage key (unique per idx_files_storage_key).
 * Useful for e.g. a download route that only has the storage key on hand.
 *
 * @param {string} storageKey
 * @param {{ columns?: string[], includeDeleted?: boolean }} [options]
 * @returns {Promise<FileRecord | null>}
 */
export async function getFileByStorageKey(storageKey, options = {}) {
  const pool = getDatabasePool();
  const selectClause = buildSelectClause(
    pool,
    resolveColumns(options.columns, ALLOWED_FILE_COLUMNS, DEFAULT_FILE_COLUMNS),
  );

  const conditions = ['storage_key = ?'];
  const params = [storageKey];
  if (!options.includeDeleted) {
    conditions.push('logically_del = false');
  }

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM files WHERE ${conditions.join(' AND ')} LIMIT 1`,
    params,
  );
  return rows[0] ?? null;
}

/**
 * Lists files in a source whose path sits under a given prefix, or every
 * file in the source if pathPrefixLower is empty. Used by the FTP-style
 * directory browser.
 *
 * @param {string} source
 * @param {string} pathPrefixLower - already-lowercased; pass '' for all
 *   files. Do NOT pre-escape "%"/"_" — this function escapes internally.
 * @param {{ columns?: string[], includeDeleted?: boolean }} [options]
 * @returns {Promise<FileRecord[]>}
 */
export async function listFilesByPathPrefix(
  source,
  pathPrefixLower,
  options = {},
) {
  const pool = getDatabasePool();
  const selectClause = buildSelectClause(
    pool,
    resolveColumns(options.columns, ALLOWED_FILE_COLUMNS, DEFAULT_FILE_COLUMNS),
  );

  const conditions = ['source = ?'];
  const params = [source];
  if (!options.includeDeleted) {
    conditions.push('logically_del = false');
  }
  if (pathPrefixLower) {
    conditions.push(`path_lower LIKE ? ESCAPE '\\\\'`);
    params.push(`${escapeLike(pathPrefixLower)}%`);
  }

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM files WHERE ${conditions.join(' AND ')} ORDER BY path`,
    params,
  );
  return rows;
}

/**
 * Substring search over a source's files by path, used by the Puck file
 * picker. Deliberately flat (ignores folder structure) since the picker
 * is a search-first UI, not a browser.
 *
 * @param {string} source
 * @param {string} queryLower - already-lowercased; pass '' to just list.
 *   Do NOT pre-escape "%"/"_" — this function escapes internally.
 * @param {number} limit
 * @param {{ columns?: string[], includeDeleted?: boolean }} [options]
 * @returns {Promise<FileRecord[]>}
 */
export async function searchFilesByPath(
  source,
  queryLower,
  limit,
  options = {},
) {
  const pool = getDatabasePool();
  const selectClause = buildSelectClause(
    pool,
    resolveColumns(options.columns, ALLOWED_FILE_COLUMNS, DEFAULT_FILE_COLUMNS),
  );

  const conditions = ['source = ?'];
  const params = [source];
  if (!options.includeDeleted) {
    conditions.push('logically_del = false');
  }
  if (queryLower) {
    conditions.push(`path_lower LIKE ? ESCAPE '\\\\'`);
    params.push(`%${escapeLike(queryLower)}%`);
  }
  params.push(limit);

  const [rows] = await pool.query(
    `SELECT ${selectClause} FROM files WHERE ${conditions.join(' AND ')} ORDER BY path LIMIT ?`,
    params,
  );
  return rows;
}

/**
 * Inserts a new file row. Caller is responsible for all validation
 * (virtual path normalization, MIME sniffing, size limits, checksum,
 * uniqueness pre-check, etc.) — this function only persists.
 *
 * @param {{
 *   source: string,
 *   path: string,
 *   pathLower: string,
 *   storageKey: string,
 *   originalName: string,
 *   mimeType: string,
 *   size: number,
 *   checksum: string,
 *   uploadedBy: string | null,
 *   public: boolean,
 * }} record
 * @returns {Promise<string>} the new row's id
 */
export async function insertFile(record) {
  const pool = getDatabasePool();
  const id = randomUUID();

  await pool.query(
    `INSERT INTO files
      (id, source, path, path_lower, storage_key, original_name, mime_type, size, checksum, uploaded_by, public)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      record.source,
      record.path,
      record.pathLower,
      record.storageKey,
      record.originalName,
      record.mimeType,
      record.size,
      record.checksum,
      record.uploadedBy,
      record.public,
    ],
  );

  return id;
}

/**
 * Soft-deletes a file (sets logically_del = true). Does NOT remove the
 * underlying storage object — callers that want the blob gone too must
 * call storage.deleteObject() themselves, typically after confirming no
 * other row still references the same storage_key.
 *
 * @param {string} id
 * @returns {Promise<boolean>} whether a row was actually updated
 */
export async function softDeleteFile(id) {
  const pool = getDatabasePool();
  const [result] = await pool.query(
    `UPDATE files SET logically_del = true WHERE id = ? AND logically_del = false`,
    [id],
  );
  return result.affectedRows > 0;
}
