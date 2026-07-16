import React, { useEffect, useState } from 'react';
import { ReactGridLayout, useContainerWidth } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GridWidget from '@/components/grid/GridWidget';
import { CONFIG } from '../../../datasource_config';

const datasource_config = CONFIG;
function createLayout(charts) {
  return charts.map((chart, index) => ({
    i: chart.id,
    x: (index % 3) * 4,
    y: Math.floor(index / 3) * 6,
    w: 4,
    h: 2,
    minW: 2,
    minH: 1,
  }));
}

export default function GridLayout({ dataSource }) {
  const STORAGE_KEY = `grid-layout-${dataSource}`;
  const { width, containerRef, mounted } = useContainerWidth();
  const rowHeightPx = 30;
  const margin = [10, 10];
  const [loaded, setLoaded] = useState(false);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [widgetItems, setWidgetItems] = useState(() =>
    datasource_config.charts.map((chart) => ({
      key: chart.id,
      title: chart.title,
      chart,
    })),
  );
  const [layout, setLayout] = useState(() =>
    createLayout(datasource_config.charts),
  );

  // Load modified layout view from localstorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setLayout(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // Update the layout for visible widgets, do not lose position of hidden widgets
  const handleLayoutChange = (newLayout) => {
    if (!loaded) return;

    setLayout((prev) => {
      const updated = prev.map((existing) => {
        const changed = newLayout.find((item) => item.i === existing.i);

        return changed || existing;
      });

      // Save modified layout to localstorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // When removing a widget save that change to specific state, separate from layouts
  const handleRemoveItem = (widgetKey) => {
    setHiddenWidgets((prev) => [...prev, widgetKey]);
  };

  const hiddenKeys = new Set(hiddenWidgets);
  const visibleLayout = layout.filter((item) => !hiddenKeys.has(item.i));

  return (
    <div ref={containerRef}>
      <ReactGridLayout
        dragConfig={{enabled: true, handle: '.drag-header-handle'}}
        width={width}
        layout={visibleLayout}
        cols={12}
        margin={margin}
        rowHeight={rowHeightPx}
        onLayoutChange={handleLayoutChange}
      >
        {widgetItems
          .filter((item) => !hiddenKeys.has(item.key))
          .map((item) => (
            <div key={item.key}>
              <GridWidget
                title={item.title}
                widgetKey={item.key}
                chartData={item}
                onRemove={() => handleRemoveItem(item.key)}
              />
            </div>
          ))}
      </ReactGridLayout>
    </div>
  );
}
