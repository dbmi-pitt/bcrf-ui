'use client';

import { useParams } from 'next/navigation';
import GridLayout from '@/components/grid/GridLayout';
import BasicLayout from '@/components/layout/BasicLayout';

export default function Page() {
  const params = useParams();
  const dataSource = params.dataSource;

  return (
    <BasicLayout fluid={true}>
      <GridLayout dataSource={dataSource} />
    </BasicLayout>
  );
}
