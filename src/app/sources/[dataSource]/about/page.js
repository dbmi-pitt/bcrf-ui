import BasicLayout from '@/components/layout/BasicLayout';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';
import Navbar from '@/components/Navbar';
import AboutView from '@/components/AboutView';
import { getPuckData } from '@/lib/actions/puck';

export default async function Page({ params }) {
  const { dataSource } = await params;
  const user = await getCurrentUser();
  const permissionSet = (await getPerms(dataSource, user.username)).data;

  const links = [
    { label: 'Overview', path: `/sources/${dataSource}` },
    { label: 'About', path: `/sources/${dataSource}/about` },
  ];

  if (permissionSet.includes('ADMIN') || permissionSet.includes('ABOUT-EDIT')) {
    links.push({ label: 'Edit', path: `/sources/${dataSource}/about/edit` });
  }
  const aboutContent = await getPuckData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <Navbar links={links} />
      <AboutView dataSourceId={dataSource} data={aboutContent.data} />
    </BasicLayout>
  );
}
