import React from 'react';
import { VictoryHistogram, VictoryTheme, VictoryChart, VictoryTooltip } from 'victory';
import log from 'xac-loglevel';

function Histogram({ data, width, height }) {
  log.debug('Histogram', data)

  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={20}
        width={width}
        height={height}
        theme={VictoryTheme.clean}
      >
        <VictoryHistogram 
         labels={({ datum }) =>
            `Bin count:\n ${datum.y}`
          }
          labelComponent={<VictoryTooltip />}
          bins={data.options?.bin.eq('customBins') ? data.options.customBins : undefined}
          data={data.data} 
        />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
