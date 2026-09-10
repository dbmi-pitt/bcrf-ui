import React, {useEffect, useContext, useState, useEffectEvent} from 'react'
import GroupedColumn from '../charts/GroupedColumn';
import SearchContext from '@/context/SearchContext';
import AppSpinner from '../AppSpinner';
import log from 'xac-loglevel'

function SourcesVizualizations() {
  const {config} = useContext(SearchContext);
  const [chartData, setChartData] = useState(null);

  const prepareChartData = useEffectEvent(() => { 
    const groups = ['patients', 'samples'];
    const groupData = {};
    for (const group of groups) {
      if (!groupData[group]) {
        groupData[group] = [];
      }
      config.cards.forEach((card) => {
        if (card[group]) {
          const source = config.summary.sources.filter((s) => card.source === s.source)
          groupData[group].push({
            total: source[0][group],
            x: card.source,
            y: (Number(card.aggregations[group]) / Number(source[0][group])) * 100,
            value: Number(card.aggregations[group]),
          });
        }
      });
    }
    log.debug('SourcesVizualizations: prepareChartData', groupData)
    setChartData(groupData);
  });

  useEffect(() => {
    prepareChartData();
  }, [config]);

  return (
    <div className="c-sourcesVizualizations">
      <div className="c-sourcesVizualizations__wrap">
        {chartData && <GroupedColumn data={chartData} />}
        {!chartData && <div className='text-center c-sourcesVizualizations__spinner'><AppSpinner fullscreen={false} /></div>}
      </div>
    </div>
  )
}

export default SourcesVizualizations