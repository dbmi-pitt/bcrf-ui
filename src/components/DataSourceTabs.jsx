import React from 'react'
import GridLayout from '@/components/grid/GridLayout';
import { Tabs } from 'antd';

function DataSourceTabs({data, dataSource}) {
   const items = [
    {
      label: 'Visualizations & Summary',
      key: 'summary',
      children: <GridLayout dataSource={dataSource} charts={data.charts} />,
    },
    {
      label: 'Clinical Data',
      key: 'table',
      children: <>Table here</>,
    },
  ];
  return (
    <div><Tabs  defaultActiveKey="summary" items={items}  /></div>
  )
}

export default DataSourceTabs