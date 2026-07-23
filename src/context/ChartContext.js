import { createContext, useEffect, useRef } from 'react';

const ChartContext = createContext({});

export const ChartProvider = ({
  children,
  setLegend,
  legend,
  isFilterable,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
}) => {
  useEffect(() => {}, []);
  const legendColors = useRef(legend);

  const updateLegend = (args) => {
    setLegend({ ...legend, ...legendColors.current });
  };

  const chartFilter = (data, value) => {
    if (!isFilterable) {
      return;
    }
    if (activeFilters.includes(value)) {
      onRemoveFilter(data.id, value);
    } else {
      onAddFilter(data.id, value);
      updateLegend({ data, value });
    }
  };

  return (
    <ChartContext.Provider
      value={{
        legendColors,
        legend,
        setLegend,
        isFilterable,
        activeFilters,
        onAddFilter,
        onRemoveFilter,
        chartFilter,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export default ChartContext;
