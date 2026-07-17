import React from 'react';
import { VictoryHistogram, VictoryTheme, VictoryChart, VictoryTooltip } from 'victory';
import log from 'xac-loglevel';

function Histogram({ data, width, height }) {
  log.debug('Histogram', data)

  const resolveBins = () => {
    const bin = data.options?.bin
    if (bin) {
      if (bin.eq('customBins')) {
        return data.options.customBins
      } else if (bin.eq('quartiles')) {
        return 4
      } else if (bin.eq('median')) {
        return 2
      } else if (bin.eq('generateBins')) {
        return Number(data.options.binMinValue)
      }
      return null
    }
    

  }

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
          bins={resolveBins()}
          data={data.data} 
        />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
