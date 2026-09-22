import Sources from '@/components/sources/Sources';
import { getAllSummaryDataAggregations } from '@/lib/sources/actions';
import log from 'xac-loglevel';

export const metadata = { title: 'Data Sources' };

export default async function SourcesPage() {
  const result = await getAllSummaryDataAggregations({});
  if (!result.success) {
    log.error('Failed to fetch summary data aggregations', result.error);
    throw new Error('Failed to fetch summary data aggregations');
  }

  log.debug('SourcesPage sources:', result.sources, result.aggregations);

  return (
    <Sources sources={result.sources} aggregations={result.aggregations} />
  );
}
