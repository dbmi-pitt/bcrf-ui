import React from 'react';
import { VictoryScatter, VictoryTheme, VictoryChart, VictoryTooltip, VictoryAxis } from 'victory';

function Scatter({ data, width, height }) {
  return (
    <div className="c-chart__scatter">
      <VictoryChart
          width={width}
          height={height}
          theme={VictoryTheme.clean}
        >
          <VictoryScatter
            size={3}
            data={data.data}
            labels={({ datum }) => datum.y}
            
            labelComponent={
              <VictoryTooltip dy={-10} />
            }
          />
          <VictoryAxis dependentAxis tickCount={10} />
          <VictoryAxis/>
        </VictoryChart>
    </div>
  );
}

export default Scatter;
