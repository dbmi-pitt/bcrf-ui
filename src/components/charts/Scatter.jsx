import THEME from '@/lib/theme';
import React from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

function Scatter({ data, width, height }) {
  const chartPaddings = {
    left: 60,
    right: 10,
    top: 10,
    bottom: 60,
  };

  return (
    <div className="c-chart__scatter">
      <VictoryChart
        width={width}
        height={height}
        padding={chartPaddings}
        theme={VictoryTheme.clean}
      >
        <VictoryScatter
          size={3}
          data={data.data}
          labels={({ datum }) =>
            `${data.labels.x} ${datum.x} \n ${data.labels.y} ${datum.y}`
          }
          labelComponent={<VictoryTooltip dy={-10} constrainToVisibleArea />}
        />
        <VictoryAxis
          label={data.labels.y}
          axisLabelComponent={<VictoryLabel dy={-10} />}
          dependentAxis
          tickCount={10}
        />
        <VictoryAxis label={data.labels.x} style={THEME.chart.ticks.style} />
      </VictoryChart>
    </div>
  );
}

export default Scatter;
