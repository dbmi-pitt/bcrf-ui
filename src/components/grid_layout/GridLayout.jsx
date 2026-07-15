import React, { useEffect, useState } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GridWidget from '@/components/grid_layout/GridWidget';
import { CONFIG } from '../../../datasource_config';

const STORAGE_KEY = 'grid-layout';
const datasource_config = CONFIG;

function createLayouts(charts) {
  return {
    lg: charts.map((chart, index) => ({
      i: chart.id,
      x: (index % 3) * 4,
      y: Math.floor(index / 3) * 4,
      w: 4,
      h: 4,
    })),
  };
}

const breakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const cols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};

export default function GridLayout() {
  const { width, containerRef, mounted } = useContainerWidth();
  const [widgetItems, setWidgetItems] = useState(() =>
    datasource_config.charts.map((chart) => ({
      key: chart.id,
      title: chart.title,
      chart,
    })),
  );
  const [layouts, setLayouts] = useState(() =>
    createLayouts(datasource_config.charts),
  );

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setLayouts(JSON.parse(saved));
    }
  }, []);

  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);

    // Save modified layout to localstorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
  };

  const handleRemoveItem = (widgetKey) => {
    setWidgetItems((prev) => prev.filter((item) => item.key !== widgetKey));

    setLayouts((prevLayouts) => {
      const updatedLayouts = {};

      Object.keys(prevLayouts).forEach((breakpoint) => {
        updatedLayouts[breakpoint] = prevLayouts[breakpoint].filter(
          (layoutItem) => layoutItem.i !== widgetKey,
        );
      });

      // localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayouts));

      return updatedLayouts;
    });
  };

  return (
    <div ref={containerRef}>
      {mounted && (
        <Responsive
          width={width}
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={30}
          onLayoutChange={handleLayoutChange}
        >
          {widgetItems.map((item) => (
            <div key={item.key}>
              <GridWidget
                title={item.title}
                widgetKey={item.key}
                key={item.key}
                chartData={item}
                onRemove={() => handleRemoveItem(item.key)}
              />
            </div>
          ))}
        </Responsive>
      )}
    </div>
  );
}
