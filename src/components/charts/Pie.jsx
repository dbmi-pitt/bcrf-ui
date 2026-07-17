import React from 'react';
import { VictoryPie, VictoryTheme, VictoryTooltip } from 'victory';

function Pie({ data, width, height }) {
  return (
    <div className="c-chart__pie">
      <VictoryPie
        // domainPadding={{ x: 10, y: 10 }}
        padding={0}
        width={width}
        height={height}
        data={data.data}
        theme={VictoryTheme.clean}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        labelComponent={<VictoryTooltip />}
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
    </div>
  );
}

export default Pie;
