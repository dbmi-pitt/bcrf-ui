import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import { getChartConfig, getChartData } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { dataSource } = await params;
  const config = await getChartConfig(dataSource);

  if (config.notFound) {
    notFound();
  }

  const data = await getChartData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <DataSourceTabs
        dataSource={dataSource}
        charts={config.charts}
        initialData={data.data}
      />
    </BasicLayout>
  );
}
