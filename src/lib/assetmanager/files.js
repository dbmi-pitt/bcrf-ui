import { randomUUID } from "crypto";
import { all, run, initDb } from "./db.js";
import { escapeLike } from "./path-utils.js";
import { userCanView } from "./auth.js";

/**
 * @typedef {Object} SourceRecord
 * @property {string} id
 * @property {string | null} name
 * @property {0 | 1} is_public  SQLite has no native boolean type — this
 *   column is stored (and returned by better-sqlite3) as 0 or 1. Truthy
 *   checks work fine as-is.
 * @property {string} created_at
 */

/**
 * @typedef {Object} SourceFileRecord
 * @property {string} id
 * @property {string} source_id
 * @property {string} path
 * @property {string} path_lower
 * @property {string} storage_key
 * @property {string} original_name
 * @property {string} mime_type
 * @property {number} size
 * @property {string} checksum
 * @property {string | null} uploaded_by
 * @property {0 | 1} is_public
 * @property {string} created_at
 * @property {0 | 1} logically_del
 */


// I'm not sure we'll need this, but I'm leaving it here just in case.

/**
 * @param {string} sourceId
 * @returns {Promise<SourceRecord | null>}
 */
export async function findSource(sourceId) {
  await initDb();
  const rows = await all(`SELECT * FROM sources WHERE id = ?`, [sourceId]);
  return rows[0] ?? null;
}

/**
 * @param {string} sourceId
 * @param {string} virtualPath
 * @returns {Promise<SourceFileRecord | null>}
 */
export async function findFileByPath(sourceId, virtualPath) {
  await initDb();
  const rows = await all(`SELECT * FROM source_files WHERE source_id = ? AND path_lower = ?`, [
    sourceId,
    virtualPath.toLowerCase(),
  ]);
  return rows[0] ?? null;
}

/**
 * Returns every file whose virtual path sits under the given directory
 * prefix (or all files in the source if dirPrefixLower is empty).
 * dirPrefixLower must already be lower-cased and end with "/" if non-empty.
 *
 * @param {string} sourceId
 * @param {string} dirPrefixLower
 * @returns {Promise<SourceFileRecord[]>}
 */
export async function listDescendants(sourceId, dirPrefixLower) {
  await initDb();
  if (!dirPrefixLower) {
    return all(`SELECT * FROM source_files WHERE source_id = ? ORDER BY path`, [sourceId]);
  }
  return all(
    `SELECT * FROM source_files WHERE source_id = ? AND path_lower LIKE ? ESCAPE '\\' ORDER BY path`,
    [sourceId, `${escapeLike(dirPrefixLower)}%`]
  );
}

/**
 * @param {{
 *   sourceId: string,
 *   virtualPath: string,
 *   storageKey: string,
 *   originalName: string,
 *   mimeType: string,
 *   size: number,
 *   checksum: string,
 *   uploadedBy: string,
 *   isPublic: boolean,
 * }} input
 * @returns {Promise<string>} the new record's id
 */
export async function createFileRecord(input) {
  await initDb();
  const id = randomUUID();
  await run(
    `INSERT INTO source_files
      (id, source_id, path, path_lower, storage_key, original_name, mime_type, size, checksum, uploaded_by, is_public)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.sourceId,
      input.virtualPath,
      input.virtualPath.toLowerCase(),
      input.storageKey,
      input.originalName,
      input.mimeType,
      input.size,
      input.checksum,
      input.uploadedBy,
      input.isPublic ? 1 : 0, // better-sqlite3 can't bind native booleans
    ]
  );
  return id;
}



/**
 * Simple substring search over a source's files, used by the Puck file
 * picker. Deliberately flat (ignores folder structure) since the picker
 * is a search-first UI, not a browser.
 *
 * @param {string} sourceId
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<SourceFileRecord[]>}
 */
export async function searchFiles(sourceId, query, limit = 50) {
  await initDb();
  const q = (query || "").trim().toLowerCase();
  if (!q) {
    return all(`SELECT * FROM source_files WHERE source_id = ? ORDER BY path LIMIT ?`, [
      sourceId,
      limit,
    ]);
  }
  return all(
    `SELECT * FROM source_files WHERE source_id = ? AND path_lower LIKE ? ESCAPE '\\' ORDER BY path LIMIT ?`,
    [sourceId, `%${escapeLike(q)}%`, limit]
  );
}

/**
 * Computes a directory listing for the FTP-style browser. Applies
 * visibility rules PER FILE before grouping, so a private file never
 * causes its parent folder to appear for a viewer who can't see it, and
 * never appears itself in the file list either.
 *
 * @param {string} sourceId
 * @param {string} dirPath
 * @param {{ id: string, role: string } | null} viewer
 * @returns {Promise<{ folders: string[], files: SourceFileRecord[] } | null>}
 */
export async function getDirectoryListing(sourceId, dirPath, viewer) {
  const source = await findSource(sourceId);
  if (!source) return null;

  if (!source.is_public && !viewer) {
    return null;
  }

  const dirPrefix = dirPath ? `${dirPath}/` : "";
  const rows = await listDescendants(sourceId, dirPrefix.toLowerCase());

  const visible = rows.filter((r) => r.is_public || (viewer && userCanView(viewer, r)));

  const folderSet = new Set();
  const files = [];

  for (const row of visible) {
    const rest = row.path.slice(dirPrefix.length);
    const slashIdx = rest.indexOf("/");
    if (slashIdx === -1) {
      files.push(row);
    } else {
      folderSet.add(rest.slice(0, slashIdx));
    }
  }

  return { folders: [...folderSet].sort(), files };
}
