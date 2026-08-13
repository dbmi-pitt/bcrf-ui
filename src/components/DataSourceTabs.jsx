'use client';

import { autoBlobDownloader } from '@/lib/general';
import { Button, Flex, Tabs, Tooltip } from 'antd';

function DataSourceTabs({ dataSource, items, clinicalData }) {
  const downloadData = () => {
    const allClinicalData = clinicalData.data;
    autoBlobDownloader(
      [JSON.jsonToCsv(allClinicalData)],
      'text/csv;charset=utf-8;',
      `${dataSource}.csv`,
    );
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={'summary'}
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
