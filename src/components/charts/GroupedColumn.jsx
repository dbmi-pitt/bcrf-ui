import React from 'react';
import {
  VictoryLegend,
  VictoryAxis,
  VictoryGroup,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
  VictoryLabel,
} from 'victory';

import THEME from '@/lib/theme';

const DoubleLabel = (props) => {
  const { x, y, text, datum, scale } = props;

  const pixelY = scale.y(0);

  return (
    <g>
      <text
        x={x}
        y={y - 10} // Offset vertically above the data point
        textAnchor="middle"
        fill={'#333'} 
        style={{ fontSize: 12, fontWeight: 'bold' }}
      >
        {datum.value}
      </text>
      <text
        x={x}
        y={pixelY + 15} 
        textAnchor="middle"
        fill={'#333'} 
        style={{ fontSize: 12, fontWeight: 'bold' }}
      >
        {datum.total}
      </text>
    </g>
  );

  // return (<VictoryLabel
  //           // Dynamic vertical offset based on positive or negative values
  //           dy={({ datum }) => (datum.y >= 0 ? -10 : 15)}
  //           textAnchor="middle"
  //           style={{ fill: "#333", fontSize: 12, fontWeight: "bold" }}
  //         />)
};

const getBars = (data) => {
  const bars = [];
  for (const group in data) {
    bars.push(
      <VictoryBar
        animate={{
          duration: 500,
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
        labels={({ datum }) => `${datum.y}`}
        labelComponent={<DoubleLabel />}
        // labelComponent={<VictoryTooltip />}
      />,
    );
  }
  return bars;
};

const getLegendData = (data) => {
  const legend = [];
  const xAxis = {};
  const groups = {};
  for (const name in data) {
    groups[name] = 0;
    data[name].map((datum) => {
      groups[name] += datum.y;
      if (!xAxis[datum.x]) {
        xAxis[datum.x] = 0;
      }
      xAxis[datum.x] += datum.y;
    });

    legend.push({
      name: `${name} (${groups[name]})`, // groups totals
      symbol: { type: 'square', fill: THEME.colors[name] },
    });
  }

  // xaxis or source totals
  for (const label in xAxis) {
    legend.push({
      name: `${label} (${xAxis[label]})`,
      symbol: { type: 'minus', fill: THEME.colors[name] },
    });
  }
  return legend;
};

function GroupedColumn({ data, width, height }) {
  return (
    <div className="c-chart__groupedColumn d-flex justify-content-start">
      <VictoryChart key={JSON.stringify(data)} theme={VictoryTheme.clean} minDomain={{ y: 0 }} maxDomain={{ y: 100 }}>
        <VictoryGroup offset={50}>{getBars(data)}</VictoryGroup>
        <VictoryAxis dependentAxis tickFormat={(t) => `${t}%`} />
        <VictoryAxis tickLabelComponent={<VictoryLabel dy={10} />} />
      </VictoryChart>
      <VictoryLegend x={0} y={20} data={getLegendData(data)} />
    </div>
  );
}

export default GroupedColumn;
