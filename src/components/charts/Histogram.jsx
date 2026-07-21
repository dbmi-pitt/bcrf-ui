import React, { useMemo } from 'react';
import {
  Bar,
  VictoryChart,
  VictoryHistogram,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis
} from 'victory';
import log from 'xac-loglevel';

const HistogramMinBar = (props) => {
  const minHeight = 5;

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
  log.debug('Histogram', data);

  const histogramData = useMemo(() => {
    const rawData = data.data;
    const list = [];
    if (rawData.length && rawData[0].y) {
      for (const d of rawData) {
        list.push(...Array(d.y).fill({ x: d.x }));
      }
    } else {
      return rawData.sort((a, b) => a.x - b.x);
    }
    return list;
  }, []);

  const getMedian = (list) => {
    const sortedData = list.map((d) => d.x).sort((a, b) => a - b);
    const median = sortedData[Math.floor(sortedData.length / 2)];
    return { median, sortedData };
  };

  const getQuartileBins = () => {
    const { median, sortedData } = getMedian(histogramData);
    const midIndex = Math.floor(sortedData.length / 2);
    const q1Arr = histogramData.slice(0, midIndex - 1);
    const q2Arr = histogramData.slice(midIndex + 1, histogramData.length - 1);
    const q1 = getMedian(q1Arr);
    const q2 = getMedian(q2Arr);
    const bins = [
      Math.min(...sortedData),
      q1.median,
      median,
      q2.median,
      Math.max(...sortedData),
    ];
    log.debug('Histogram.getQuartileBins', bins);
    return bins;
  };

  const getMedianBins = () => {
    const { median, sortedData } = getMedian(histogramData);
    return [Math.min(...sortedData), median, Math.max(...sortedData)];
  };

  const resolveBins = () => {
    const bin = data.options?.bin;
    if (bin) {
      if (bin.eq('customBins')) {
        return data.options.customBins;
      } else if (bin.eq('quartiles')) {
        return getQuartileBins();
      } else if (bin.eq('median')) {
        return getMedianBins();
      } else if (bin.eq('generateBins')) {
        // TODO handle like cbioportal
        return Number(data.options.binMinValue);
      }
      return null;
    }
  };

  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={10}
        padding={30}
        width={width}
        height={height}
        theme={VictoryTheme.clean}
      >
        <VictoryHistogram
          bins={resolveBins()}
          data={histogramData}
          dataComponent={<HistogramMinBar />}
          labels={({ datum }) =>
            `Number of samples: ${datum.y}\nRange: ${datum.x0} - ${datum.x1}`
          }
          labelComponent={<VictoryTooltip constrainToVisibleArea />}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseOver: () => [
                  {
                    target: 'labels',
                    mutation: () => ({ active: true }),
                  },
                ],
                onMouseOut: () => [
                  {
                    target: 'labels',
                    mutation: () => ({ active: false }),
                  },
                ],
              },
            },
          ]}
        />
        
      </VictoryChart>
    </div>
  );
}

export default Histogram;
