import React from 'react';
import {
  Bar,
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
          onLoad: { duration: 500 } 
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

function GroupedColumn({ data, width, height }) {
  
  return (
    <div className="c-chart__groupedColumn" style={{ width: '100%', maxWidth: '2000px' }}>
      <VictoryChart 
        theme={VictoryTheme.clean}>
        <VictoryGroup
          offset={50}
          >
          {getBars(data)}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
}

export default GroupedColumn;
