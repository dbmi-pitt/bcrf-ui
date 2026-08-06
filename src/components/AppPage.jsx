'use client';
import React, {useContext} from 'react';
import BleedLayout from '@/components/layout/BleedLayout';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import ContentGenerator from '@/components/ContentGenerator';

export default function AppPage() {
  const { content } = useContext(AppContext)

  return (
    <div>
      <BleedLayout>
        {content && content.locale && <ContentGenerator content={content.locale} />}
        {!content || !content.locale && <AppSpinner />}
      </BleedLayout>
    </div>
  );
}
