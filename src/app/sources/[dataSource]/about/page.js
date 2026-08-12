import BasicLayout from '@/components/layout/BasicLayout';
import AboutView from '@/components/AboutView';
import { getPuckData } from '@/lib/actions/puck';
import SourceNavbar from '@/components/SourceNavbar';


export default async function Page({ params }) {
  const { dataSource } = await params;
  const aboutContent = await getPuckData(dataSource);


  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource}/>
      <AboutView dataSourceId={dataSource} data={aboutContent.data} />
    </BasicLayout>
  );
}
