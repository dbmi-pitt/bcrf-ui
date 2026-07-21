import GridLayout from '@/components/grid/GridLayout';
import { Tabs } from 'antd';

function DataSourceTabs({ dataSource, charts, initialData }) {
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
      <Tabs defaultActiveKey="summary" items={items} />
    </div>
  );
}

export default DataSourceTabs;
