import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import { getCurrentUser } from '@/lib/actions/auth';
import {
  getAllClinicalData,
  getChartConfig,
  getChartData,
} from '@/lib/actions/charts.js';
import { getSummaryDataSource } from '@/lib/actions/content';
import { getPerms } from '@/lib/actions/perms';
import { notFound } from 'next/navigation';

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

  const user = await getCurrentUser();
  const permissionSet = (await getPerms(dataSource, user.username)).data;

  const chartData = await getChartData(dataSource);
  const clinicalData = await getAllClinicalData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <DataSourceTabs
        dataSource={dataSource}
        charts={config.charts}
        summaryDataSource={summaryDataSource}
        initialData={chartData.data}
        clinicalData={clinicalData}
        editPagePerms={
          permissionSet.includes('ADMIN') ||
          permissionSet.includes('ABOUT-EDIT')
        }
      />
    </BasicLayout>
  );
}
