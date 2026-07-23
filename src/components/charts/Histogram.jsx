import THEME from '@/lib/theme';
import { useMemo } from 'react';
import {
  Bar,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

import log from 'xac-loglevel';

function findBin(x, bins) {
  let selected = bins[0];
  for (const bin of bins) {
    if (x > bin.value) {
      selected = bin;
    } else {
      return bin
    }
  }
  return selected;
}

function sortIntoBins(bins, data) {
  const buckets = bins.map((bin) => ({
    bin,
    label: bin.label,
    items: [],
    count: 0,
  }));
  const byLabel = new Map(buckets.map((b) => [b.label, b]));

  for (const item of data) {
    const bin = findBin(item.x, bins);
    const bucket = byLabel.get(bin.label);
    bucket.items.push(item);
    bucket.count += 1;
  }

  return buckets;
}

const HistogramMinBar = (props) => {
  if (props.index === props.rawData.bins.length - 2) return <></>
  const {rawData, chartPaddings, index} = props

  const minHeight = 3;
  const barProps = {...props}

  const value = props.datum.y;
  const actualHeight = Math.abs(props.y0 - props.y);
  log.info(`value: ${value} actual: ${actualHeight}`);
  const margins = chartPaddings.left + chartPaddings.right

  if (index !== 0 && (index !== rawData.bins.length - 1)) {
    barProps.alignment = "start";
    barProps.x += ((props.width - margins) / rawData.bins.length / 4)
  }

  // Don't modify zero-value bars
  if (value <= 0) {
    return <Bar {...barProps} />;
  }

  if (actualHeight < minHeight) {
    return <Bar {...barProps} y={props.y0 - minHeight} />;
  }
  return <Bar  {...barProps} />;
};

function Histogram({ data, width, height }) {
  const binnedData = useMemo(() => {
    const bins = data.bins;
    const rawData = data.data;
    return sortIntoBins(bins, rawData);
  }, [data]);

  const histogramData = binnedData.map(({ label, count }) => ({
    bin: label,
    count: count,
  }));

  const chartPaddings = {
    left: 30,
    right: 10,
    top: 10,
    bottom: 35,
  };

  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={{ x: 50, y: 10 }}
        padding={chartPaddings}
        width={width}
        height={height}
        theme={VictoryTheme.clean}
      >
        <VictoryBar
          data={histogramData}
          dataComponent={<HistogramMinBar rawData={data} chartPaddings={chartPaddings} />}
          x="bin"
          y="count"
          labels={(props) => {
            const { datum, data } = props;
            const index = props.index;
            let inclusiveLabel = data[index + 1]?.bin;
            if (index === data.length - 2) {
              const bin = binnedData.filter((b) => b.label === inclusiveLabel);
              inclusiveLabel = bin[0].bin.value;
            }
            const range =
              index === 0 || index === data.length - 1
                ? datum.bin
                : `(${data[index].bin}, ${inclusiveLabel}]`;
            return `Number of samples: ${datum.count}\nRange: ${range}`;
          }}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea
              dx={(props) => {
                if (props.index === 0 || props.index === binnedData.length - 1)
                  return 0;
                return 15;
              }}
            />
          }
        />
        <VictoryAxis dependentAxis />
        <VictoryAxis
          style={THEME.chart.ticks.style}
        />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
