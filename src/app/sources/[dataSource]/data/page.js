import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';
import { downloadLinksDemo } from '@/lib/data/demo-globus-links';
import Button from 'react-bootstrap/Button';
import { DownloadIcon } from 'lucide-react';
import { Badge } from 'react-bootstrap';


export default async function Page({ params }) {
  const { dataSource } = await params;
  const dlLinks = downloadLinksDemo[dataSource];
  
  
  
  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource}/>
      
      {dlLinks.map((link) => (
        <div className="my-2" key={link.name}>
          <Button size="" href={link.url}><DownloadIcon />{link.name}</Button> - <Badge  bg="info">{link.count??link.fileCount}</Badge>  {link.description}
        </div>
      ))}
      
    </BasicLayout>
  );
}
