import BasicLayout from '@/components/layout/BasicLayout';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';
import Navbar from '@/components/Navbar';

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
  links.push({ label: 'Globus', path: `/sources/${dataSource}/data` });

  return (
    <BasicLayout fluid={true}>
      <Navbar links={links} />
      <h3>Globus File Manager</h3>
      <p>This is a placeholder for Globus.</p>
    </BasicLayout>
  );
}
