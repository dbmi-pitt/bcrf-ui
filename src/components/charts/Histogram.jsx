import ChartContext from '@/context/ChartContext';
import THEME from '@/lib/theme';
import { useCallback, useContext, useMemo, useState } from 'react';
import {
  Bar,
  VictoryAxis,
  VictoryBar,
  VictoryBrushContainer,
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
  if (props.index === props.rawData.bins.length - 2) return <></>;
  const { rawData, chartPaddings, index } = props;

  const minHeight = 3;
  const barProps = { ...props };

  const value = props.datum.y;
  const actualHeight = Math.abs(props.y0 - props.y);
  const margins = chartPaddings.left + chartPaddings.right;

  if (index !== 0 && index !== rawData.bins.length - 1) {
    barProps.alignment = 'start';
    barProps.x += (props.width - margins) / rawData.bins.length / 4;
  }

  // Don't modify zero-value bars
  if (value <= 0) {
    return <Bar {...barProps} />;
  }

  if (actualHeight < minHeight) {
    return <Bar {...barProps} y={props.y0 - minHeight} />;
  }
  return <Bar {...barProps} />;
};

function Histogram({ data, width, height }) {
  const { isFilterable, activeFilters, onAddFilter, onRemoveFilter } =
    useContext(ChartContext);

  const [brushDomain, setBrushDomain] = useState({ x: [0, 0] });
  const [highlightedBins, setHighlightedBins] = useState([]);

  const binnedData = useMemo(() => {
    const bins = data.bins;
    const rawData = data.data;
    return sortIntoBins(bins, rawData);
  }, [data]);

  const histogramData = useMemo(() => {
    return binnedData.map(({ label, count }) => ({
      bin: label,
      count: count,
    }));
  }, [binnedData]);

  const binCoordinates = useMemo(() => {
    return histogramData.map((d, i) => {
      if (i === 0 || i === histogramData.length - 1) {
        return [i + 1 - 0.25, i + 1 + 0.25];
      } else {
        return [i + 1.5 - 0.25, i + 1.5 + 0.25];
      }
    });
  }, [histogramData]);

  const binLabels = histogramData.map((d) => d.bin);

  const chartPaddings = {
    left: 30,
    right: 10,
    top: 10,
    bottom: 35,
  };
  const handleBrushDomainChange = useCallback(
    (domain) => {
      setBrushDomain(domain);

      // determine which bins are highlighted based on the brush domain
      const highlighted = [];
      for (const [index, [x0, x1]] of binCoordinates.entries()) {
        log.debug('Bin coordinates:', [x0, x1], 'Index:', index);
        if (x1 < domain.x[0] || x0 > domain.x[1]) {
          // bin is outside of the brush domain
          continue;
        } else {
          // bin is inside of the brush domain
          highlighted.push(binLabels[index]);
        }
      }
      setHighlightedBins(highlighted);
    },
    [binCoordinates, binLabels],
  );

  const handleBrushDomainChangeEnd = useCallback(
    (domain, props) => {
      // log.debug('Brush domain changed:', domain, props);
      // setBrushDomain({ x: [0, 0] });
      log.debug('Highlighted bins:', highlightedBins);
      onAddFilter(data.id, highlightedBins, 'range');
    },
    [data.id, highlightedBins, onAddFilter],
  );

  const handleBrushCleared = useCallback(() => {
    setBrushDomain({ x: [0, 0] });
    setHighlightedBins([]);
  }, []);

  const isBinHighlighted = useCallback(
    (datum) => {
      if (brushDomain.x[0] === 0 && brushDomain.x[1] === 0) {
        return true;
      }

      return highlightedBins.includes(datum.bin);
    },
    [brushDomain.x, highlightedBins],
  );

  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={{ x: 50, y: 10 }}
        padding={chartPaddings}
        width={width}
        height={height}
        theme={VictoryTheme.clean}
        containerComponent={
          isFilterable ? (
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={brushDomain}
              defaultBrushArea="none"
              disable={!isFilterable}
              onBrushDomainChange={handleBrushDomainChange}
              onBrushDomainChangeEnd={handleBrushDomainChangeEnd}
              onBrushCleared={handleBrushCleared}
              brushStyle={{
                stroke: 'transparent',
                fill: '#1677ff',
                fillOpacity: 0.15,
              }}
            />
          ) : undefined
        }
      >
        <VictoryBar
          data={histogramData}
          dataComponent={
            <HistogramMinBar rawData={data} chartPaddings={chartPaddings} />
          }
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
          style={{
            data: {
              opacity: ({ datum }) => (isBinHighlighted(datum) ? 1 : 0.3),
            },
          }}
        />
        <VictoryAxis dependentAxis />
        <VictoryAxis style={THEME.chart.ticks.style} />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
