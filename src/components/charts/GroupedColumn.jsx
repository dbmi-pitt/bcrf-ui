import React, { useEffect, useRef } from 'react';
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
  const containerRef = useRef(null);
  
  
  /** 
   * Victory package is limited and oddly doesn't allow for wrapping its VictoryChart children in a single <g> tag.
   * Thus this method does just that after render with JS.
   * Individual <g> tags in the VictoryContainer are all wrapped into a single <g> tag called "c-chart__group" 
   * and a style transform to move the <g> down so the legend doesn't overlap the bars.
   */
  const wrapAllInGroup = () => {
    if (!containerRef.current) return;
    const bars = containerRef.current.querySelectorAll('g');
    let legend;
    if (bars.length > 0) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'c-chart__group');
      group.setAttribute('transform', 'translate(0, 20)');
      bars.forEach((bar, index) => {
        if (index === 0) {
          legend = bar;
        } else {
          group.appendChild(bar);
        }
      });
      const svg = containerRef.current.querySelector('svg');
      const height = svg.getBoundingClientRect().height;
      const newHeight = height + 50; // Adjust the height to accommodate the legend
      svg.setAttribute('height', newHeight);
      svg.appendChild(legend).appendChild(group);
    }
  }
  useEffect(() => {
    wrapAllInGroup();
   }, [data]);

  return (
    <div className="c-chart__groupedColumn d-flex justify-content-start" ref={containerRef}>
      <VictoryChart
        key={new Date().getTime()}
        theme={VictoryTheme.clean}
        width={500}
        minDomain={style.minDomain}
        maxDomain={style.maxDomain}
      >
        <VictoryLegend orientation="horizontal" data={getLegendData(data)} />
        <VictoryGroup offset={50}>{getBars(data, style)}</VictoryGroup>
        <VictoryAxis dependentAxis tickFormat={style.tickFormat} />
        <VictoryAxis
          tickFormat={(text) =>
            text.length > 9 ? `${text.slice(0, 9)}` : text
          }
          tickLabelComponent={
            <VictoryLabel
              angle={20}
              textAnchor="start"
              dy={10} />
          }
        />
      </VictoryChart>
    </div>
  );
}

export default GroupedColumn;
