import React from 'react';
import { VictoryHistogram, VictoryTheme, VictoryChart } from 'victory';

function Histogram({ data, width, height }) {
  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={20}
        width={width}
        height={height}
        
        theme={VictoryTheme.clean}
      >
        <VictoryHistogram data={data.data} />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
