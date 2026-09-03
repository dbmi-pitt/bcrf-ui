import ClinicalData from '@/components/ClinicalData';
import DataSourceTabs from '@/components/DataSourceTabs';
import GridLayout from '@/components/grid/GridLayout';
import BasicLayout from '@/components/layout/BasicLayout';
import SourceNavbar from '@/components/SourceNavbar';
import TermsOfUse from '@/components/TermsOfUse';
import { PERMISSION } from '@/lib/permission/constants';
import { hasCurrentUserPermission } from '@/lib/permission/services';
import { getSourceChartData } from '@/lib/sources/actions';
import {
  getSourceChartConfig,
  getSourceClinicalData,
  getSummaryDataSource,
} from '@/lib/sources/services';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { dataSource } = await params;
  const config = await getSummaryDataSource(dataSource);
  return { title: config.name || ' - Data Source' };
}

export default async function Page({ params }) {
  const { dataSource } = await params;
  const summaryDataSource = await getSummaryDataSource(dataSource);
  if (!summaryDataSource) {
    notFound();
  }

  const authorizedToViewData = await hasCurrentUserPermission(
    dataSource,
    PERMISSION.GLOBUS_READ,
  );
  if (!authorizedToViewData) {
    return (
      <BasicLayout fluid={true}>
        <TermsOfUse
          termsText="You are not authorized to view this data source"
          authorizedToViewData={authorizedToViewData}
          summaryDataSource={summaryDataSource}
        />
      </BasicLayout>
    );
  }

  const config = await getSourceChartConfig(dataSource);
  const chartData = await getSourceChartData(dataSource);
  const clinicalData = await getSourceClinicalData(dataSource);

  const header = (
    <>
      <div key="header" className="card px-4 pt-3 mb-2">
        <h1 className="fs-4">{summaryDataSource.name}</h1>
        <p>{summaryDataSource.description}</p>
      </div>
      {summaryDataSource?.terms_of_use && (
        <TermsOfUse
          termsText={summaryDataSource.terms_of_use}
          authorizedToViewData={authorizedToViewData}
          summaryDataSource={summaryDataSource}
        />
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
