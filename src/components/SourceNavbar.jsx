'use server';

import { PERMISSION } from '@/lib/permission/constants';
import { hasCurrentUserPermission } from '@/lib/permission/services';
import { getSummaryDataSource } from '@/lib/sources/services';
import Navbar from './Navbar';

export default async function SourceNavbar(param) {
  const dataSource = param.dataSource;
  const authorizedToEdit = await hasCurrentUserPermission(
    dataSource,
    PERMISSION.ABOUT_WRITE,
  );
  const authorizedToViewData = await hasCurrentUserPermission(
    dataSource,
    PERMISSION.GLOBUS_READ,
  );
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
