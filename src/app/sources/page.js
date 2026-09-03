import Sources from '@/components/sources/Sources';
import { getSummaryDataSources } from '@/lib/sources/actions.js';
import log from 'xac-loglevel';

export const metadata = { title: 'Data Sources' };

export default async function SourcesPage() {
  const summary = await getSummaryDataSources();
  log.debug('SourcesPage summary:', summary.aggregations);

  return <Sources summary={summary.sources} />;
}
