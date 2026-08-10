import DataSourceTabs from '@/components/DataSourceTabs';
import BasicLayout from '@/components/layout/BasicLayout';
import {
  getAllClinicalData,
  getChartConfig,
  getChartData,
} from '@/lib/actions/charts.js';
import { notFound } from 'next/navigation';
import { getPuckData } from '@/lib/actions/puck';

import { getCurrentUser } from '@/lib/actions/auth';
import { getPerms } from '@/lib/actions/perms';

export default async function Page({ params }) {
  const { dataSource } = await params;
  const config = await getChartConfig(dataSource);

  if (config.notFound) {
    notFound();
  }

  const chartData = await getChartData(dataSource);
  const clinicalData = await getAllClinicalData(dataSource);

  const aboutContent = await getPuckData(dataSource);
  
  const user = await getCurrentUser();
  const permission_set = (await getPerms(dataSource,user.username)).data;
  
  return (
    <BasicLayout fluid={true}>
      <DataSourceTabs
        dataSource={dataSource}
        charts={config.charts}
        initialData={chartData.data}
        clinicalData={clinicalData}
        aboutContent={aboutContent}
        editPagePerms={permission_set.includes("ADMIN") || permission_set.includes("ABOUT-EDIT")}

      />
    </BasicLayout>
  );
}
