import ClinicalData from '@/components/ClinicalData';
import DataSourceTabs from '@/components/DataSourceTabs';
import GridLayout from '@/components/grid/GridLayout';
import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';
import {
  getAllClinicalData,
  getChartConfig,
  getChartData,
} from '@/lib/actions/charts.js';
import { getSummaryDataSource } from '@/lib/actions/sources';
import { notFound } from 'next/navigation';
import { hasPermission } from '@/lib/actions/perms';
import { Button } from 'antd';

export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name || ' - Data Source' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const config = await getChartConfig(dataSource);
  const authorizedToViewData = await hasPermission(dataSource, 'GLOBUS-READ');

  if (config.notFound) {
    notFound();
  }

  const summaryDataSource = await getSummaryDataSource(dataSource);
  const chartData = await getChartData(dataSource);
  const clinicalData = await getAllClinicalData(dataSource);

  const header = (
    <>
      <div key="header" className="card px-4 pt-3 mb-2">
        <h1 className="fs-4">{summaryDataSource.name}</h1>
        <p>{summaryDataSource.description}</p>
      </div>
      {summaryDataSource?.terms_of_use && (
        <>
          <div
            key="terms_of_use"
            className="card  text-bg-warning px-4 pt-3 mb-2"
          >
            <h1 className="fs-4">Terms of Use</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: summaryDataSource.terms_of_use,
              }}
            />
            {!authorizedToViewData && (
              <Button
                type={'primary'}
                className={'mb-1'}
                style={{ alignSelf: 'flex-start' }}
                href="mailto:BCRFGDH@pitt.edu"
              >
                Request Access
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );

  const items = [
    {
      label: 'Visualizations & Summary',
      key: 'summary',
      children: (
        <GridLayout
          key="summary"
          dataSource={dataSource}
          charts={config.charts}
          initialData={chartData.data}
          header={header}
        />
      ),
    },
    {
      label: 'Tabular View',
      key: 'table',
      children: (
        <ClinicalData
          key="table"
          data={clinicalData}
          columnKeys={
            clinicalData.data && clinicalData.data.length > 0
              ? [...new Set(clinicalData.data.flatMap(Object.keys))]
              : []
          }
        />
      ),
    },
  ];

  return (
    <BasicLayout fluid={true}>
      <SourceNavbar dataSource={dataSource} />
      <DataSourceTabs
        dataSource={dataSource}
        items={items}
        clinicalData={clinicalData}
      />
    </BasicLayout>
  );
}
