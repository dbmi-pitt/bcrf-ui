import { notFound } from "next/navigation";
import { getUserSourcePerms } from "@/lib/assetmanager/auth";
import { getDirectoryListing } from "@/lib/assetmanager/files";
import FileBrowser from "./file-browser";


/**
 * @param {{ params: { dataSource: string, dirpath?: string[] } }} props
 */
export default async function BrowsePage({ params }) {
  const {dataSource, dirpath } = await params;
  
  const currentPath = (dirpath ?? []).join("/");
  const usp = await getUserSourcePerms(dataSource);
  const listing = await getDirectoryListing(dataSource, currentPath, usp.id ?? null);
  
  
  // Deliberately 404 rather than 403 for unauthorized/nonexistent sources,
  // so we don't confirm existence of private sources to anonymous users.
  if (!listing) notFound();

  return (
    <FileBrowser
      sourceId={dataSource}
      currentPath={currentPath}
      folders={listing.folders}
      files={listing.files.map((f) => ({
        id: f.id,
        path: f.path,
        originalName: f.original_name,
        mimeType: f.mime_type,
        size: f.size,
        createdAt: f.created_at,
      }))}
    />
  );
}
