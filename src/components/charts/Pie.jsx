import ChartContext from '@/context/ChartContext';
import { useContext } from 'react';
import { Flyout, VictoryPie, VictoryPortal, VictoryTheme, VictoryTooltip, Slice } from 'victory';

const TraceableSlice = (props) => {
  const pieProps = { ...props };
  const { datum, style, legendColors } = pieProps;
  legendColors.current[datum.x] = style.fill;
  

  return <Slice {...pieProps} />;
};

function Pie({ data, width, height }) {
  const { legendColors, isFilterable, activeFilters, chartFilter } =
    useContext(ChartContext);


  const checkboxFilter = (value) => {
    chartFilter(data, value);
  };

  return (
    <div className="c-chart__pie">
      <VictoryPie
        padding={0}
        width={width}
        height={height}
        data={data.data}
        dataComponent={<TraceableSlice legendColors={legendColors} />}
        theme={VictoryTheme.clean}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        labelComponent={<VictoryTooltip constrainToVisibleArea />}
        style={{
          data: {
            cursor: isFilterable ? 'pointer' : 'default',
            opacity: ({ datum }) =>
              activeFilters.length === 0 || activeFilters.includes(datum.x)
                ? 1
                : 0.25,
          },
        }}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onClick: () => [
                {
                  target: 'data',
                  mutation: (props) => {
                    checkboxFilter(props.datum.x);
                    return null;
                  },
                },
              ],
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
