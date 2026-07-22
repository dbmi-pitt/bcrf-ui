import { VictoryPie, VictoryTheme, VictoryTooltip } from 'victory';

function Pie({
  data,
  width,
  height,
  isFilterable,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
}) {
  const checkboxFilter = (value) => {
    if (!isFilterable) {
      return;
    }
    if (activeFilters.includes(value)) {
      onRemoveFilter(data.id, value);
    } else {
      onAddFilter(data.id, value);
    }
  };

  return (
    <div className="c-chart__pie">
      <VictoryPie
        padding={0}
        width={width}
        height={height}
        data={data.data}
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
