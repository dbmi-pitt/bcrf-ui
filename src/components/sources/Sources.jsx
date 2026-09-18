import BasicLayout from '@/components/layout/BasicLayout';
import SourcesExplorer from './SourcesExplorer';

export default function Sources({ sources, aggregations }) {
  return (
    <BasicLayout fluid={undefined}>
      <SourcesExplorer
        sources={sources}
        aggregations={aggregations}
      />
    </BasicLayout>
  );
}
