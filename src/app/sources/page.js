import Sources from '@/components/sources/Sources';
import { getSummaryDataSources } from '@/lib/sources/services.js';

export const metadata = { title: 'Data Sources' };

export default async function SourcesPage() {
  const summary = await getSummaryDataSources();

  return <Sources summary={summary} />;
}
