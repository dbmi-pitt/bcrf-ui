'use client';

import GridLayout from '@/components/grid/GridLayout';
import { autoBlobDownloader } from '@/lib/general';
import { Button, Flex, Tabs, Tooltip } from 'antd';
import ClinicalData from './ClinicalData';
import AboutView from './AboutView';
import AboutEdit from './AboutEdit';


import { useParams, usePathname, useRouter } from 'next/navigation';


function DataSourceTabs({ dataSource, charts, initialData, clinicalData, aboutContent }) {
  const router = useRouter();
  const pathname= usePathname();
  const isAbout = pathname.endsWith('/about');
  
  
  const handleChange = (key)=> {
    if (key==='about'){
      router.push(`/sources/${dataSource}/about`);
      return
    }else if(isAbout) {
      router.push(`/sources/${dataSource}`);
      return
    }
  }

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
    {
      label: 'About',
      key: 'about',
      children: aboutContent?<AboutView data={aboutContent.data}/>:<div/>,
    },
    // {
    //   label: 'Edit',
    //   key: 'edit',
    // },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey={isAbout?'about':'summary'}
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
