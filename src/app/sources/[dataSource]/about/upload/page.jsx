import { notFound } from 'next/navigation';
import { getUserSourcePerms, userCanUploadTo } from '@/lib/assetmanager/auth';
import AssetsUploader from '@/components/AssetsUploader';
import BasicLayout from '@/components/layout/BasicLayout';
import AboutH1 from '@/components/AboutH1';

/**
 * @param {{ params: { dataSource: string } }} props
 */
export default async function UploadPage({ params }) {
  const { dataSource } = await params;

  const usp = await getUserSourcePerms(dataSource);

  // Same pattern as the browse page: 404 rather than 403, so we don't
  // confirm to an unauthorized visitor that this source even exists.
  if (!usp || !userCanUploadTo(usp)) {
    notFound();
  }

  return (
    <BasicLayout fluid={true}>
      <AboutH1
        dataSourceId={dataSource}
        title={'Upload assets'}
        path={'browse'}
        buttonTitle={'Browse Files'}
        buttonClassName={'bi-archive'}
      />
      <AssetsUploader dataSourceId={dataSource} />
    </BasicLayout>
  );
}
