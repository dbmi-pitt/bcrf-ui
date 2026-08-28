import Unauthorized from '@/app/unauthorized';
import AboutEdit from '@/components/AboutEdit';
import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';
import { getPuckData } from '@/lib/actions/puck';
import { hasPermission } from '@/lib/permission/services';
import { getSummaryDataSource } from '@/lib/sources/services';

export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name + ' - Edit' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const authorized = await hasPermission(dataSource, 'ABOUT-EDIT');
  if (!authorized) {
    // person is not authorized
    return <Unauthorized />;
  }

  const aboutContent = await getPuckData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource} />
      <AboutEdit dataSourceId={dataSource} data={aboutContent.data} />
    </BasicLayout>
  );
}
