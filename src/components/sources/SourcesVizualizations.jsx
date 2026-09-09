import React, {useEffect, useContext, useState, useEffectEvent} from 'react'
import Accordion from 'react-bootstrap/Accordion';
import GroupedColumn from '../charts/GroupedColumn';
import SearchContext from '@/context/SearchContext';
import AppSpinner from '../AppSpinner';

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
          groupData[group].push({
            x: card.source,
            y: Number(card[group]),
          });
        }
      });
      
    }
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