import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import {
  getAllClinicalData,
  getChartConfig,
  getChartData,
} from '@/lib/actions/charts.js';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';

export default async function Page({ params }) {
  const { dataSource } = await params;
  const config = await getChartConfig(dataSource);

  if (config.notFound) {
    notFound();
  }


  const user = await getCurrentUser();
  const permission_set = (await getPerms(dataSource,user.username)).data;
      

  const chartData = await getChartData(dataSource);
  const clinicalData = await getAllClinicalData(dataSource);

  return (
    <BasicLayout fluid={true}>
      <DataSourceTabs
        dataSource={dataSource}
        charts={config.charts}
        initialData={chartData.data}
        clinicalData={clinicalData}
        editPagePerms={permission_set.includes("ADMIN") || permission_set.includes("ABOUT-EDIT")}
      />
    </BasicLayout>
  );
}
