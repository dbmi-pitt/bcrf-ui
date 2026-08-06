'use client';
import React, {useContext, useState, useEffectEvent, useEffect} from 'react';
import BleedLayout from '@/components/layout/BleedLayout';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import ContentGenerator from '@/components/ContentGenerator';

export default function Home() {
  const { content } = useContext(AppContext)


  return (
    <div>
      <BleedLayout>
        {content && <ContentGenerator content={content.locale} />}
        {!content && <AppSpinner />}
      </BleedLayout>
    </div>
  );
}
