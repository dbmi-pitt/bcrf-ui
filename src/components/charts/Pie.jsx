import React from 'react';
import { VictoryPie, VictoryTheme, VictoryTooltip } from 'victory';

function Pie({ data, layout }) {
  return (
    <div className="c-chart__pie">
      <VictoryPie
        domainPadding={{ x: 10, y: 10 }}
        width={layout.w}
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
