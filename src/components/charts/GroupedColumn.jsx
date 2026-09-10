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
  const { x, y, datum, scale } = props;
  const pixelY = scale.y(0);
  return (
    <g>
      <text
        x={x}
        y={y - 10}
        textAnchor="middle"
        fill={'#333'}
        style={{ fontSize: 12, fontWeight: 'bold' }}
      >
        <tspan className='axisValue'>{datum.value}</tspan>
      </text>
      <text
        x={x}
        y={pixelY + 15}
        textAnchor="middle"
        fill={'#333'}
        style={{ fontSize: 12, fontWeight: 'bold' }}
      >
        <tspan className='axisValue'>{datum.total}</tspan>
      </text>
    </g>
  );
};

const getBars = (data, style) => {
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
        labelComponent={style.labelComponent || <VictoryTooltip />}
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
      symbol: { type: 'square', fill: THEME.colors[name] },
    });
  }
  return legend;
};

function GroupedColumn({
  data,
  style = {
    minDomain: { y: 0 },
    maxDomain: { y: 100 },
    tickFormat: (t) => `${t}%`,
    labelComponent: <DoubleLabel />,
  },
}) {
  return (
    <div className="c-chart__groupedColumn d-flex justify-content-start">
      <VictoryChart
        key={new Date().getTime()}
        theme={VictoryTheme.clean}
        minDomain={style.minDomain}
        maxDomain={style.maxDomain}
      >
        <VictoryGroup offset={50}>{getBars(data, style)}</VictoryGroup>
        <VictoryAxis dependentAxis tickFormat={style.tickFormat} />
        <VictoryAxis tickLabelComponent={<VictoryLabel dy={10} />} />
      </VictoryChart>
      <VictoryLegend x={0} y={100} data={getLegendData(data)} />
    </div>
  );
}

export default GroupedColumn;
