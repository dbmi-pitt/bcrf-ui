import React from 'react';
import {
  VictoryChart,
  VictoryHistogram,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

function Histogram({ data, width, height }) {
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
          data={data.data}
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
