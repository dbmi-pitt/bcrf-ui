import BasicLayout from '@/components/layout/BasicLayout';
import { getPuckData } from '@/lib/actions/puck';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';
import Navbar from '@/components/Navbar';
import AboutEdit from '@/components/AboutEdit';

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
      <AboutEdit dataSourceId={dataSource} data={aboutContent.data} />
    </BasicLayout>
  );
}
