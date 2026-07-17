import React from 'react';
import { VictoryScatter, VictoryTheme, VictoryChart, VictoryTooltip } from 'victory';

function Scatter({ data, width, height }) {
  return (
    <div className="c-chart__scatter">
      <VictoryChart
          width={width}
          height={height}
          theme={VictoryTheme.clean}
        >
          <VictoryScatter
            size={7}
            data={data.data}
            labels={({ datum }) => datum.y}
            
            labelComponent={
              <VictoryTooltip dy={-10} />
            }
          />
        </VictoryChart>
    </div>
  );
}

export default Scatter;
