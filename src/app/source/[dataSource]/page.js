import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import { getChartData } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { dataSource } = await params;
  const data = await getChartData(dataSource);

  if (data.notFound) {
    notFound();
  }

  return (
    <BasicLayout fluid={true}>
      <DataSourceTabs data={data} dataSource={dataSource} />
    </BasicLayout>
  );
}
