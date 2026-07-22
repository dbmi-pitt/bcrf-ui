import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import { getAllClinicalData, getChartConfig, getChartData } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { dataSource } = await params;
  const config = await getChartConfig(dataSource);

  if (config.notFound) {
    notFound();
  }

  const chartData = await getChartData(dataSource);
  const clinicalData = await getAllClinicalData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <DataSourceTabs
        dataSource={dataSource}
        charts={config.charts}
        initialData={chartData.data}
        clinicalData={clinicalData}
      />
    </BasicLayout>
  );
}
