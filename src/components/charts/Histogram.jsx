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
      break;
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
  const minHeight = 3;

  const value = props.datum.y;
  const actualHeight = Math.abs(props.y0 - props.y);
  log.info(`value: ${value} actual: ${actualHeight}`);

  // Don't modify zero-value bars
  if (value <= 0) {
    return <Bar {...props} />;
  }

  if (actualHeight < minHeight) {
    return <Bar {...props} y={props.y0 - minHeight} />;
  }

  return <Bar {...props} />;
};

function Histogram({ data, width, height }) {
  const binnedData = useMemo(() => {
    const bins = data.bins;
    const rawData = data.data;
    return sortIntoBins(bins, rawData);
  }, [data]);

  log.debug('Histogram', binnedData);

  const histogramData = binnedData.map(({ label, count }) => ({
    bin: label,
    count: count,
  }));

  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={{ x: 50, y: 10 }}
        padding={30}
        width={width}
        height={height}
        theme={VictoryTheme.clean}
      >
        <VictoryBar
          data={histogramData}
          dataComponent={<HistogramMinBar />}
          x="bin"
          y="count"
          labels={({ datum }) => datum.count}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryAxis label={data.labels.y} dependentAxis />
        <VictoryAxis
          label={data.labels.x}
          style={THEME.chart.ticks.style}
        />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
