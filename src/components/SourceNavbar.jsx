'use server';

import { getSummaryDataSource } from '@/lib/actions/sources';
import { hasPermission } from '@/lib/permission/services';
import Navbar from './Navbar';

export default async function SourceNavbar(param) {
  const dataSource = param.dataSource;
  const authorizedToEdit = await hasPermission(dataSource, 'ABOUT-EDIT');
  const authorizedToViewData = await hasPermission(dataSource, 'GLOBUS-READ');
  const sds = await getSummaryDataSource(dataSource);

  const links = [
    { label: 'Overview', path: `/sources/${dataSource}` },
    { label: 'About', path: `/sources/${dataSource}/about` },
  ];

  if (authorizedToEdit) {
    links.push({ label: 'Edit', path: `/sources/${dataSource}/about/edit` });
  }
  if (authorizedToViewData) {
    links.push({ label: 'Data Sets', path: `/sources/${dataSource}/data` });
  }
  return <Navbar links={links} dataSource={sds.name} />;
}
