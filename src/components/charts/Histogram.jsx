import React from 'react';
import { VictoryHistogram, VictoryTheme, VictoryChart } from 'victory';

function Histogram({ data, layout }) {
  return (
    <div className="c-chart__Histogram">
      <VictoryChart
        domainPadding={20}
        width={layout.w}
        height={layout.h - 40} // magic number for now.
        theme={VictoryTheme.clean}
      >
        <VictoryHistogram data={data.data} />
      </VictoryChart>
    </div>
  );
}

export default Histogram;
