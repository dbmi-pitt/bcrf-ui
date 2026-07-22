'use client';

import { useEffect, useRef, useState } from 'react';
import { ReactGridLayout, useContainerWidth } from 'react-grid-layout';

import GridWidget from '@/components/grid/GridWidget';
import { getChartData } from '@/lib/data';
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

export default function GridLayout({ dataSource, charts, initialData }) {
  const STORAGE_KEY = `grid-layout-${dataSource}`;
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });
  const rowHeightPx = 30;
  const margin = [10, 10];
  const cols = 12;

  const loadedRef = useRef(false);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartData, setChartData] = useState(initialData);
  const [layout, setLayout] = useState(() => createLayout(charts));

  const hasActiveFilters = Object.keys(filters).length > 0;

  const widgetItems = charts.map((chart) => ({
    ...chart,
    key: chart.id,
    data: chartData[chart.id] ?? initialData[chart.id],
  }));

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLayout(JSON.parse(saved));
    }
    loadedRef.current = true;
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!hasActiveFilters) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChartData(initialData);
      return;
    }

    let cancelled = false;

    async function loadData() {
      const result = await getChartData(dataSource, filters);
      if (cancelled || result.notFound) {
        return;
      }
      setChartData(result.data);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [dataSource, filters, hasActiveFilters, initialData]);

  // Add a filter value for a given chart
  const handleAddFilter = (chartId, value) => {
    setFilters((prev) => {
      const existing = prev[chartId] ?? [];
      if (existing.includes(value)) {
        return prev;
      }
      return { ...prev, [chartId]: [...existing, value] };
    });
  };

  // Remove a filter value for a given chart
  const handleRemoveFilter = (chartId, value) => {
    setFilters((prev) => {
      const existing = prev[chartId] ?? [];
      const updated = existing.filter((v) => v !== value);
      if (updated.length === 0) {
        const rest = { ...prev };
        delete rest[chartId];
        return rest;
      }
      return { ...prev, [chartId]: updated };
    });
  };

  // Update the layout for visible widgets, do not lose position of hidden widgets
  const handleLayoutChange = (newLayout) => {
    if (!loadedRef.current) return;

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

  return (
    <div ref={containerRef}>
      {mounted && (
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
                  chart={item}
                  layout={getWidgetLayout(item.key)}
                  onRemove={() => handleRemoveItem(item.key)}
                  isFilterable={item.isFilterable}
                  activeFilters={filters[item.key] ?? []}
                  onAddFilter={handleAddFilter}
                  onRemoveFilter={handleRemoveFilter}
                />
              </div>
            ))}
        </ReactGridLayout>
      )}
    </div>
  );
}
