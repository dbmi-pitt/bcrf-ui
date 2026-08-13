"use client";

import Link from "next/link";
import { FolderOutlined, FileOutlined, UpOutlined  } from "@ant-design/icons";

/**
 * @param {{
 *   sourceId: string,
 *   currentPath: string,
 *   folders: string[],
 *   files: Array<{
 *     id: string,
 *     path: string,
 *     originalName: string,
 *     mimeType: string,
 *     size: number,
 *     createdAt: string | Date,
 *   }>,
 * }} props
 */
export default function FileBrowser({ sourceId, currentPath, folders, files }) {
  const segments = currentPath ? currentPath.split("/") : [];
  const browseBase = `/sources/${sourceId}/about/browse`;
  const filesBase = `/sources/${sourceId}/about/files`;

  const parentPath = segments.slice(0, -1).join("/");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm mb-4 text-gray-600 flex-wrap">
        <Link href={browseBase} className="hover:underline">
          root
        </Link>
        {segments.map((seg, i) => {
          const segPath = segments.slice(0, i + 1).join("/");
          return (
            <span key={segPath} className="flex items-center gap-1">
              <span>/</span>
              <Link href={`${browseBase}/${segPath}`} className="hover:underline">
                {seg}
              </Link>
            </span>
          );
        })}
      </nav>

      <table className="w-full text-sm border-t border-gray-200">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Size</th>
            <th className="py-2 font-medium">Modified</th>
          </tr>
        </thead>
        <tbody>
          {segments.length > 0 && (
            <tr>
              <td colSpan={3} className="py-2">
                <Link
                  href={`${browseBase}/${parentPath}`}
                  className="flex items-center gap-2 text-gray-600 hover:underline"
                >
                  <UpOutlined size={16} /> ..
                </Link>
              </td>
            </tr>
          )}

          {folders.map((name) => {
            const childPath = currentPath ? `${currentPath}/${name}` : name;
            return (
              <tr key={name} className="border-b border-gray-100">
                <td className="py-2">
                  <Link
                    href={`${browseBase}/${childPath}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <FolderOutlined size={16} className="text-gray-500" />
                    {name}
                  </Link>
                </td>
                <td className="py-2 text-gray-400">—</td>
                <td className="py-2 text-gray-400">—</td>
              </tr>
            );
          })}

          {files.map((file) => {
            const name = file.path.split("/").pop();
            return (
              <tr key={file.id} className="border-b border-gray-100">
                <td className="py-2">
                  <a
                    href={`${filesBase}/${file.path}`}
                    className="flex items-center gap-2 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileOutlined size={16} className="text-gray-500" />
                    {name}
                  </a>
                </td>
                <td className="py-2 text-gray-500">{formatSize(file.size)}</td>
                <td className="py-2 text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}

          {folders.length === 0 && files.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-gray-400">
                Empty directory
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** @param {number} bytes */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes;
  let i = -1;
  do {
    size /= 1024;
    i++;
  } while (size >= 1024 && i < units.length - 1);
  return `${size.toFixed(1)} ${units[i]}`;
}
