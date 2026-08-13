import BasicLayout from '@/components/layout/BasicLayout';
import { getPuckData } from '@/lib/actions/puck';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';
import AboutEdit from '@/components/AboutEdit';
import SourceNavbar from '@/components/SourceNavbar';

import { getSummaryDataSource } from '@/lib/actions/content';
export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name + ' - Edit' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const user = await getCurrentUser();
  const permissionSet = (await getPerms(dataSource, user.username)).data;
  if (
    !permissionSet.includes('ADMIN') &&
    !permissionSet.includes('ABOUT-EDIT')
  ) {
    // person is not authorized
    return <div>Not Authorized.</div>;
  }
  
  const aboutContent = await getPuckData(dataSource);
  
  return (
    <BasicLayout fluid={true}>
      
      <SourceNavbar dataSource={dataSource}/>
      <AboutEdit dataSourceId={dataSource} data={aboutContent.data} />
    </BasicLayout>
  );
}
