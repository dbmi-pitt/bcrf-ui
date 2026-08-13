import fs from "fs";
import fsp from "fs/promises";
import path from "path";

/**
 * Storage abstraction. This default implementation writes to local disk
 * under STORAGE_ROOT, keyed by server-generated storage keys.
 */

const STORAGE_ROOT = process.env.ASSETMANAGER_ROOT

/** @param {string} storageKey */
function resolveStoragePath(storageKey) {
  // storageKey is always server-generated (uuid-based), never derived from
  // user input, so a plain join is safe here.
  return path.join(STORAGE_ROOT, storageKey);
}

/**
 * @param {string} storageKey
 * @param {Buffer} buffer
 */
export async function putObject(storageKey, buffer) {
  const fullPath = resolveStoragePath(storageKey);
  await fsp.mkdir(path.dirname(fullPath), { recursive: true });
  await fsp.writeFile(fullPath, buffer);
}

/** @param {string} storageKey */
export async function getObjectBuffer(storageKey) {
  return fsp.readFile(resolveStoragePath(storageKey));
}

/** @param {string} storageKey */
export function getObjectStream(storageKey) {
  return fs.createReadStream(resolveStoragePath(storageKey));
}

/** @param {string} storageKey */
export async function deleteObject(storageKey) {
  await fsp.rm(resolveStoragePath(storageKey), { force: true });
}
