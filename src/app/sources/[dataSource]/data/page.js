import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';

export default async function Page({ params }) {
  const { dataSource } = await params;
  
  
  
  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource}/>
      <h3>Globus File Manager</h3>
      <p>This is a placeholder for Globus.</p>
    </BasicLayout>
  );
}
