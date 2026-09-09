import React from 'react';
import {
  VictoryLegend,
  VictoryAxis,
  VictoryGroup,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

import THEME from '@/lib/theme';

const getBars = (data) => {
  const bars = [];
  for (const group in data) {
    bars.push(
      <VictoryBar
        animate={{
          duration: 1000,
          onLoad: { duration: 500 },
        }}
        style={
          THEME.colors[group]
            ? { data: { fillOpacity: 1, fill: THEME.colors[group] } }
            : {}
        }
        barWidth={40}
        key={group}
        data={data[group]}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        labelComponent={<VictoryTooltip />}
      />,
    );
  }
  return bars;
};

const getLegendData = (data) => {
  const legend = [];
  for (const name in data) {
    legend.push({
      name,
      symbol: { fill: THEME.colors[name] },
    });
  }
  return legend;
};

function GroupedColumn({ data, width, height }) {
  return (
    <div
      className="c-chart__groupedColumn"
      style={{ width: '100%', maxWidth: '2000px' }}
    >
      <VictoryChart theme={VictoryTheme.clean}>
        <VictoryGroup offset={50}>{getBars(data)}</VictoryGroup>
        <VictoryLegend x={125} y={20} data={getLegendData(data)} />
      </VictoryChart>
    </div>
  );
}

export default GroupedColumn;
