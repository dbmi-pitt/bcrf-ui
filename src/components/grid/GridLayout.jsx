'use client';

import { useEffect, useState } from 'react';
import { ReactGridLayout, useContainerWidth } from 'react-grid-layout';

import GridWidget from '@/components/grid/GridWidget';
import { getChartData } from '@/lib/data/index';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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
  const cols = 12;

  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [widgetItems, setWidgetItems] = useState([]);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCharts() {
      const data = await getChartData(dataSource);
      if (cancelled) return;

      if (data.notFound) {
        setNotFound(true);
        setLoaded(true);
        return;
      }

      const { charts } = data;

      setWidgetItems(
        charts.map((chart) => ({
          key: chart.id,
          title: chart.title,
          chart,
        })),
      );

      const saved = localStorage.getItem(STORAGE_KEY);
      setLayout(saved ? JSON.parse(saved) : createLayout(charts));
      setLoaded(true);
    }

    loadCharts();

    return () => {
      cancelled = true;
    };
  }, [dataSource, STORAGE_KEY]);

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

  const getWidgetLayout = (key) => {
    const colWidthPx = (width - margin[0] * (cols - 1)) / cols;
    const item = layout.find((l) => l.i === key);
    if (!item) {
      return { w: 0, h: 0, m: 40 };
    }
    const w = item.w * colWidthPx + (item.w - 1) * margin[0];
    const h = item.h * rowHeightPx + (item.h - 1) * margin[1];
    return { w, h, m: 40 };
  };

  if (!loaded) {
    // Loading
    return <div ref={containerRef}>Loading...</div>;
  }

  if (notFound) {
    // Not found
    return (
      <div ref={containerRef}>No datasource found named {dataSource}.</div>
    );
  }

  return (
    <div ref={containerRef}>
      <ReactGridLayout
        dragConfig={{ enabled: true, handle: '.drag-header-handle' }}
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
                layout={getWidgetLayout(item.key)}
                onRemove={() => handleRemoveItem(item.key)}
              />
            </div>
          ))}
      </ReactGridLayout>
    </div>
  );
}
