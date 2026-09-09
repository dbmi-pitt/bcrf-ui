import Unauthorized from '@/app/unauthorized';
import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';
import { downloadLinksDemo } from '@/lib/data/demo-globus-links';
import { PERMISSION } from '@/lib/permission/constants';
import { hasCurrentUserPermission } from '@/lib/permission/services';
import { getSummaryDataSource } from '@/lib/sources/services';
import { DownloadIcon } from 'lucide-react';
import { Badge } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name + ' - Data Sets' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const authorizedToViewData = await hasCurrentUserPermission(
    dataSource,
    PERMISSION.GLOBUS_READ,
  );
  if (!authorizedToViewData) {
    // person is not authorized
    return <Unauthorized />;
  }

  const dlLinks = downloadLinksDemo[dataSource];

  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource} />

      {dlLinks.map((link) => (
        <div className="my-2" key={link.name}>
          <Button size="" href={link.url} target="_blank">
            <DownloadIcon />
            {link.name}
          </Button>{' '}
          - <Badge bg="info">{link.count ?? link.fileCount}</Badge>{' '}
          {link.description}
        </div>
      ))}
    </BasicLayout>
  );
}
