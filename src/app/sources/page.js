import Sources from '@/components/sources/Sources';
import { getSummaryDataSources } from '@/lib/actions/content.js';

export const metadata = { title: 'Data Sources' };

export default async function SourcesPage() {
  const summary = await getSummaryDataSources();

  return <Sources summary={summary} />;
}
