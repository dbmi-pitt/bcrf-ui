'use server';

import { SUMMARY } from '@/lib/content/summaryDataSources.js';
import { requireSession } from './index.js';

export const getSummaryDataSources = async () => {
  await requireSession();
  return SUMMARY;
};

export const getSummaryDataSource = async (dataSource) => {
  await requireSession();
  const summaryDataSource = SUMMARY.data_sources.find(
    (ds) => ds.source === dataSource,
  );
  if (!summaryDataSource) {
    return { notFound: true };
  }
  return summaryDataSource;
};
