import { notFound } from "next/navigation";
import { getUserSourcePerms, userCanUploadTo } from "@/lib/assetmanager/auth";
import UploadForm from "./upload-form";

/**
 * @param {{ params: { dataSource: string } }} props
 */
export default async function UploadPage({ params }) {
  const {dataSource} = await params
  
  const usp = await getUserSourcePerms(dataSource);

  // Same pattern as the browse page: 404 rather than 403, so we don't
  // confirm to an unauthorized visitor that this source even exists.
  if (!usp || !userCanUploadTo(usp)) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-lg font-semibold mb-1">Upload assets</h1>
      <p className="text-sm text-gray-500 mb-6">
        Drag files onto the box below, or click to choose files. You can select or drop
        multiple files at once — they'll upload in parallel.
      </p>
      <UploadForm sourceId={dataSource} />
    </div>
  );
}
