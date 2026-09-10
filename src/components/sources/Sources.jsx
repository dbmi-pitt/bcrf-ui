import BasicLayout from '@/components/layout/BasicLayout';
import SourcesExplorer from './SourcesExplorer';

export default function Sources({ sources, aggregations, activeSources }) {
  return (
    <BasicLayout fluid={undefined}>
      <SourcesExplorer
        sources={sources}
        aggregations={aggregations}
        activeSources={activeSources}
      />
    </BasicLayout>
  );
}
