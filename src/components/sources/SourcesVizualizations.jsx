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
  const { config } = useContext(SearchContext);
  const groups = [
    { key: 'patients', valueField: 'patientCount', totalField: 'totalPatientCount' },
    { key: 'samples', valueField: 'sampleCount', totalField: 'totalSampleCount' },
  ];
  const chartData = groups.reduce((groupData, { key, valueField, totalField }) => {
    groupData[key] = config.cards.reduce((values, source) => {
      const total = source[totalField];
      const value = source[valueField];
      if (value && total) {
        values.push({
          total,
          x: source.name || source.source,
          y: (Number(value) / Number(total)) * 100,
          value: Number(value),
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
