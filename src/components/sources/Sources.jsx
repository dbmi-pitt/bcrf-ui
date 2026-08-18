import BasicLayout from '@/components/layout/BasicLayout';
import SourcesExplorer from './SourcesExplorer';

export default function Sources({ summary }) {
  return (
    <BasicLayout fluid={undefined}>
      <SourcesExplorer dataSources={summary.data_sources} />
    </BasicLayout>
  );
}
