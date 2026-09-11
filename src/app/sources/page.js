import Sources from '@/components/sources/Sources';
import { getSummaryDataAggregations } from '@/lib/sources/actions';
import { getSummaryDataSources } from '@/lib/sources/services.js';
import log from 'xac-loglevel';

export const metadata = { title: 'Data Sources' };

export default async function SourcesPage() {
  const sources = await getSummaryDataSources();
  const aggregations = await getSummaryDataAggregations();

  log.debug('SourcesPage sources:', sources, aggregations);

  return (
    <Sources
      sources={sources}
      aggregations={aggregations.aggregations}
      activeSources={aggregations.sources}
    />
  );
}
