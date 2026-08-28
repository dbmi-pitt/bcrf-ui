import AboutView from '@/components/AboutView';
import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';
import { getPuckData } from '@/lib/actions/puck';
import { getSummaryDataSource } from '@/lib/sources/services';

export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name + ' - About' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const aboutContent = await getPuckData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource} />
      <AboutView dataSourceId={dataSource} data={aboutContent.data} />
    </BasicLayout>
  );
}
