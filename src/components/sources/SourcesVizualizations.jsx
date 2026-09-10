import AppSpinner from '@/components/AppSpinner';
import SearchContext from '@/context/SearchContext';
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import log from 'xac-loglevel';

const GroupedColumn = dynamic(
  () => import('@/components/charts/GroupedColumn'),
  {
    ssr: false,
    loading: () => (
      <div className="text-center c-sourcesVizualizations__spinner">
        <AppSpinner fullscreen={false} />
      </div>
    ),
  },
);

function SourcesVizualizations() {
  const { activeSources } = useContext(SearchContext);
  const chartData = ['patients', 'samples'].reduce((groupData, group) => {
    groupData[group] = activeSources.reduce((values, source) => {
      if (source[group]) {
        values.push({
          x: source.source,
          y: Number(source[group]),
        });
      }
      return values;
    }, []);
    return groupData;
  }, {});

  log.debug('SourcesVizualizations: chart data', chartData);

  return (
    <div className="c-sourcesVizualizations">
      <div className="c-sourcesVizualizations__wrap">
        <GroupedColumn data={chartData} />
      </div>
    </div>
  );
}

export default SourcesVizualizations;
