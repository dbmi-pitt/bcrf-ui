import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import {
  getAllClinicalData,
  getChartConfig,
  getChartData,
} from '@/lib/actions/charts.js';
import { getSummaryDataSource } from '@/lib/actions/content';
import { notFound } from 'next/navigation';
import SourceNavbar from '@/components/SourceNavbar';

export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name || 'Data Source' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const config = await getChartConfig(dataSource);

  if (config.notFound) {
    notFound();
  }

  const summaryDataSource = await getSummaryDataSource(dataSource);
  const chartData = await getChartData(dataSource);
  const clinicalData = await getAllClinicalData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource}/>
      <DataSourceTabs
        dataSource={dataSource}
        charts={config.charts}
        summaryDataSource={summaryDataSource}
        initialData={chartData.data}
        clinicalData={clinicalData}
      />
    </BasicLayout>
  );
}
