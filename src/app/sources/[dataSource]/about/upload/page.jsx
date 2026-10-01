import { notFound } from "next/navigation";
import { getUserSourcePerms, userCanUploadTo } from "@/lib/assetmanager/auth";
import AssetsUploader from '@/components/AssetsUploader';
import BasicLayout from '@/components/layout/BasicLayout';
import UploadForm from "./upload-form";
import Link from "next/link";

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
    <BasicLayout fluid={true}>
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-lg font-semibold mb-2">Upload assets</h1>
        <Link href={`/sources/${dataSource}/about/browse`} className="c-btn c-btn--secondary mb-3">Browse Files</Link>
        {/* <UploadForm sourceId={dataSource} /> */}
        <AssetsUploader dataSourceId={dataSource} />
      </div>
    </BasicLayout>
  );
}
