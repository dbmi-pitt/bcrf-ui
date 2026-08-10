'use client';

import GridLayout from '@/components/grid/GridLayout';
import { autoBlobDownloader } from '@/lib/general';
import { Button, Flex, Tabs, Tooltip } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import AboutEdit from './AboutEdit';
import AboutView from './AboutView';
import ClinicalData from './ClinicalData';

function DataSourceTabs({
  dataSource,
  charts,
  summaryDataSource,
  initialData,
  clinicalData,
  aboutContent,
  editPagePerms,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAbout = pathname.contains('/about');
  const isAboutEdit = pathname.contains('/about/edit');

  const defaultActiveKey = isAbout
    ? isAboutEdit
      ? 'edit'
      : 'about'
    : 'summary';

  const handleChange = (key) => {
    if (key === 'about') {
      router.push(`/sources/${dataSource}/about`);
      return;
    } else if (key === 'edit') {
      router.push(`/sources/${dataSource}/about/edit`);
      return;
    } else if (isAbout) {
      router.push(`/sources/${dataSource}`);
      return;
    }
  };

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
          summaryDataSource={summaryDataSource}
        />
      ),
    },
    {
      label: 'Tabular View',
      key: 'table',
      children: <ClinicalData data={clinicalData} />,
    },
    {
      label: 'About',
      key: 'about',
      children: aboutContent ? (
        <AboutView dataSourceId={dataSource} data={aboutContent.data} />
      ) : (
        <div />
      ),
    },
  ];
  if (editPagePerms) {
    items.push({
      label: 'Edit',
      key: 'edit',
      children: aboutContent ? (
        <AboutEdit dataSourceId={dataSource} data={aboutContent.data} />
      ) : (
        <div />
      ),
    });
  }
  console.log('editPagePerms:', editPagePerms);

  return (
    <div>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        onChange={handleChange}
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
