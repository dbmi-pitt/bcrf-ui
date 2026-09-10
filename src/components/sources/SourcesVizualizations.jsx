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
  const { activeSources, config } = useContext(SearchContext);
  const sourceTotals = new Map(
    config.sources.map(({ source, patients, samples }) => [
      source,
      { patients, samples },
    ]),
  );
  const chartData = ['patients', 'samples'].reduce((groupData, group) => {
    groupData[group] = activeSources.reduce((values, source) => {
      const total = sourceTotals.get(source.source)?.[group];
      if (source[group] && total) {
        values.push({
          total,
          x: source.source,
          y: (Number(source[group]) / Number(total)) * 100,
          value: Number(source[group]),
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
