import { getUserSourcePerms } from '@/lib/assetmanager/auth';
import { getDirectoryListing } from '@/lib/assetmanager/files';
import { notFound } from 'next/navigation';
import BasicLayout from '@/components/layout/BasicLayout';
import AppFileBrowser from '@/components/AppFileBrowser';
import AboutH1 from '@/components/AboutH1';

/**
 * @param {{ params: { dataSource: string, dirpath?: string[] } }} props
 */
export default async function BrowsePage({ params }) {
  const { dataSource, dirpath } = await params;

  const currentPath = (dirpath ?? []).join('/');
  const usp = await getUserSourcePerms(dataSource);
  const listing = await getDirectoryListing(dataSource, currentPath, usp);

  // Deliberately 404 rather than 403 for unauthorized/nonexistent sources,
  // so we don't confirm existence of private sources to anonymous users.
  if (!listing) {
    notFound();
  }

  return (
    <BasicLayout fluid={true}>
      <AboutH1
        dataSourceId={dataSource}
        title={'File Browser'}
        path={'upload'}
        buttonTitle={'Upload Assets'}
        buttonClassName={'bi-cloud-arrow-up'}
      />
      <AppFileBrowser dataSourceId={dataSource} files={listing.files} />
    </BasicLayout>
  );
}
