"use client"; 
import GridLayout from '@/components/grid/GridLayout';
import { autoBlobDownloader } from '@/lib/general';
import { Button, Tabs, Flex, Tooltip } from 'antd';

function DataSourceTabs({ dataSource, charts, initialData }) {
  const downloadData = () => {
    // TODO grab data and export to csv
    //autoBlobDownloader([JSON.jsonToCsv(initialData)], 'text/csv;charset=utf-8;', `${dataSource}.csv`)
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
      children: <>TODO Table here</>,
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
