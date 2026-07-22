import React from 'react';
import { VictoryScatter, VictoryTheme, VictoryChart, VictoryTooltip } from 'victory';

function Scatter({ data, width, height }) {
  return (
    <div className="c-chart__scatter">
      <VictoryChart
        width={width}
        padding={{ top: 10, bottom: 35, left: 45, right: 10 }}
        height={height}
        theme={VictoryTheme.clean}
      >
        <VictoryScatter
          size={3}
          data={data.data}
          labels={({ datum }) => datum.y}

          labelComponent={<VictoryTooltip dy={-10} constrainToVisibleArea />}
        />
      </VictoryChart>
    </div>
  );
}

export default Scatter;
