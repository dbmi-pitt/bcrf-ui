import { useMemo } from 'react';
import {
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
    if (x >= bin.value) {
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
          x="bin"
          y="count"
          labels={({ datum }) => datum.count}
          labelComponent={<VictoryTooltip />}
        />
        <VictoryAxis dependentAxis />
        <VictoryAxis />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
