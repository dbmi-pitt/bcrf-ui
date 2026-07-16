import React from 'react';
import { VictoryScatter, VictoryTheme, VictoryChart, VictoryTooltip } from 'victory';

function Scatter({ data, layout }) {
  return (
    <div className="c-chart__scatter">
      <VictoryChart
          width={layout.w}
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
