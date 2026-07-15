'use client';
import React, {useContext} from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import { Masonry } from 'antd';
import AppCard from '@/components/SummaryCard';

export default function Home() {
  const { content } = useContext(AppContext)

  return (
    <div>
      <BasicLayout fluid={undefined}>
        {content.summary && <Masonry
          columns={2}
          gutter={5}
          items={content.summary.data_sources.map((source, index) => ({
            key: `item-${index}`,
            data: source,
          }))}
          itemRender={({ data, index }) => (
            <AppCard data={data} index={index} key={`card-${index}`} />
          )}
        />}
      </BasicLayout>
    </div>
  );
}
