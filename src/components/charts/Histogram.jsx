import React from 'react';
import { VictoryHistogram, VictoryTheme, VictoryChart } from 'victory';

function Histogram({ data, layout }) {
  return (
    <div className="c-chart__histogram">
      <VictoryChart
        domainPadding={20}
        width={layout.w}
        
        theme={VictoryTheme.clean}
      >
        <VictoryHistogram data={data.data} />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
