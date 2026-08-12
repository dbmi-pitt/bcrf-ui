'use server';

import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';
import Navbar from './Navbar';
import { getSummaryDataSource } from '@/lib/actions/content';


export default async function SourceNavbar(param) {
  const dataSource = param.dataSource
  const user = await getCurrentUser();  
  const permissionSet = (await getPerms(dataSource, user.username)).data;
  const sds = await getSummaryDataSource(dataSource);

  // console.log(dataSource, user, permissionSet, sds)
  const links = [
    { label: 'Overview', path: `/sources/${dataSource}` },
    { label: 'About', path: `/sources/${dataSource}/about` },
  ];

  if (permissionSet.includes('ADMIN') || permissionSet.includes('ABOUT-EDIT')) {
    links.push({ label: 'Edit', path: `/sources/${dataSource}/about/edit` });
  }
  if (permissionSet.includes('ADMIN') || permissionSet.includes('GLOBUS-READ')) {
    links.push({ label: 'Data Sets', path: `/sources/${dataSource}/data` });
  }
  return (
    <Navbar links={links} dataSource={sds.name}/>
  );
}
