import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.ASSETMANAGER_DB_PATH;

let dbInstance = null;
let initPromise = null;

function getDb() {
  if (!dbInstance) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
  }
  return dbInstance;
}

/**
 * @param {string} sql
 * @param {unknown[]} params
 */
export async function run(sql, params = []) {
  getDb().prepare(sql).run(...params);
}

/**
 * @param {string} sql
 * @param {unknown[]} params
 */
export async function all(sql, params = []) {
  return getDb().prepare(sql).all(...params);
}

async function createSchema() {
  await run(`
    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY,
      name TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS source_files (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL,
      path TEXT NOT NULL,
      path_lower TEXT NOT NULL,
      storage_key TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      checksum TEXT NOT NULL,
      uploaded_by TEXT,
      is_public INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      logically_del INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (source_id) REFERENCES sources(id)
    )
  `);

  // Case-insensitive uniqueness per source: "Images/Photo.PNG" and
  // "images/photo.png" are treated as the same virtual path.
  await run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_source_files_unique_path
    ON source_files (source_id, path_lower)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_source_files_source
    ON source_files (source_id)
  `);
}

/** Call before any query. Safe to call many times; only runs once per process. */
export function initDb() {
  if (!initPromise) {
    initPromise = createSchema();
  }
  return initPromise;
}
