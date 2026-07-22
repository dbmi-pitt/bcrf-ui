'use client';

import GridLayout from '@/components/grid/GridLayout';
import { autoBlobDownloader } from '@/lib/general';
import { Button, Flex, Tabs, Tooltip } from 'antd';
import ClinicalData from './ClinicalData';

function DataSourceTabs({ dataSource, charts, initialData, clinicalData }) {
  const downloadData = () => {
    const allClinicalData = clinicalData.data;
    autoBlobDownloader(
      [JSON.jsonToCsv(allClinicalData)],
      'text/csv;charset=utf-8;',
      `${dataSource}.csv`,
    );
  };
  const items = [
    {
      label: 'Visualizations & Summary',
      key: 'summary',
      children: (
        <GridLayout
          dataSource={dataSource}
          charts={charts}
          initialData={initialData}
        />
      ),
    },
    {
      label: 'Tabular View',
      key: 'table',
      children: <ClinicalData data={clinicalData} />,
    },
  ];
  return (
    <div>
      <Tabs
        defaultActiveKey="summary"
        tabBarExtraContent={
          <Flex wrap gap="small">
            <Tooltip placement="topLeft" title={<span>Download all data</span>}>
              <Button onClick={downloadData}>
                <i className="bi bi-download"></i>
              </Button>
            </Tooltip>
          </Flex>
        }
        items={items}
      />
    </div>
  );
}

export default DataSourceTabs;
