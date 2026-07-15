'use client';
import React, {useContext} from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import { Masonry } from 'antd';
import AppCard from '@/components/AppCard';

export default function Home() {
  const {content} = useContext(AppContext)

  return (
    <div>
      <BasicLayout fluid={undefined}>
        {content.summary && <Masonry
          columns={4}
          gutter={16}
          items={content.summary.data_sources}
          itemRender={({ data, index }) => (
            <AppCard data={data} key={`card-${index}`} />
          )}
        />}
      </BasicLayout>
    </div>
  );
}
