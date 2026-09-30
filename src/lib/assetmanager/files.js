import { listFilesByPathPrefix } from '@/lib/database/files';
import { getSource } from '@/lib/database/sources';
import { userCanView } from './auth.js';

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
  const source = await getSource(sourceId, ['source', 'public']);
  if (!source) {
    return null;
  }

  if (!source.public && !viewer) {
    return null;
  }

  const dirPrefix = dirPath ? `${dirPath}/` : '';
  const rows = await listFilesByPathPrefix(sourceId, dirPrefix.toLowerCase());

  const visible = rows.filter(
    (r) => r.public || (viewer && userCanView(viewer, r)),
  );

  const folderSet = new Set();
  const files = [];

  for (const row of visible) {
    const rest = row.path.slice(dirPrefix.length);
    const slashIdx = rest.indexOf('/');
    if (slashIdx === -1) {
      files.push(row);
    } else {
      folderSet.add(rest.slice(0, slashIdx));
    }
  }

  return { folders: [...folderSet].sort(), files };
}
