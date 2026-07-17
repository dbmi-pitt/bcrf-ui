import React from 'react';
import { VictoryHistogram, VictoryTheme, VictoryChart, VictoryTooltip } from 'victory';
import log from 'xac-loglevel';

function Histogram({ data, layout }) {
  log.debug('Histogram', data)
  
  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={20}
        width={layout.w}
        theme={VictoryTheme.clean}
      >
        <VictoryHistogram 
         labels={({ datum }) =>
            `Bin count:\n ${datum.y}`
          }
          labelComponent={<VictoryTooltip />}
          data={data.data} 
        />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
