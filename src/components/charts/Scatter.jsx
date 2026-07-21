import React from 'react';
import { VictoryScatter, VictoryTheme, VictoryChart, VictoryTooltip, VictoryAxis, VictoryLabel } from 'victory';
import * as d3 from 'd3'

function Scatter({ data, width, height }) {
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
  .domain(data.data.map((d) => d.x))


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
            labels={({ datum }) => `${data.labels.x} ${datum.x} \n ${data.labels.y} ${datum.y}`}
            style={{
              data: {
                fill: ({ datum }) => colorScale(datum.x)
              }
            }}
            labelComponent={
              <VictoryTooltip dy={-10} />
            }
          />
          <VictoryAxis label={data.labels.y} axisLabelComponent={<VictoryLabel dy={-10} />} dependentAxis tickCount={10} />
          <VictoryAxis label={data.labels.x}/>
        </VictoryChart>
    </div>
  );
}

export default Scatter;
