'use client';

import { useEffect, useRef, useState } from 'react';
import { ReactGridLayout, useContainerWidth } from 'react-grid-layout';

import GridWidget from '@/components/grid/GridWidget';
import { getChartData } from '@/lib/data';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const chartLayoutDefaults = {
  pie: {
    w: 2,
    h: 1,
    minW: 2,
    minH: 1,
  },

  histogram: {
    w: 4,
    h: 1,
    minW: 4,
    minH: 1,
  },

  scatter: {
    w: 4,
    h: 2,
    minW: 4,
    minH: 2,
  },

  table: {
    w: 4,
    h: 2,
    minW: 4,
    minH: 2,
  },
};

const TAG_COLOR_PALETTE = [
  'blue',
  'green',
  'purple',
  'orange',
  'magenta',
  'cyan',
  'gold',
  'volcano',
];

function getChartLayout(chart) {
  const chartType = chart.types[0];

  return (
    chartLayoutDefaults[chartType] || {
      w: 2,
      h: 1,
      minW: 2,
      minH: 1,
    }
  );
}

function createLayout(charts) {
  let x = 0;
  let y = 0;

  return charts.map((chart) => {
    const size = getChartLayout(chart);

    const item = {
      i: chart.id,
      x,
      y,
      ...size,
    };

    x += size.w;

    if (x >= 12) {
      x = 0;
      y += 8;
    }

    return item;
  });
}

export default function GridLayout({ dataSource, charts, initialData }) {
  const STORAGE_KEY = `grid-layout-${dataSource}`;
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });
  const [gridWidth, setGridWidth] = useState(0);
  const rowHeightPx = 30;
  const margin = [10, 10];
  const cols = 12;

  const loadedRef = useRef(false);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartData, setChartData] = useState(initialData);
  const [layout, setLayout] = useState(() => createLayout(charts));
  const [legend, setLegend] = useState({});

  const hasActiveFilters = Object.keys(filters).length > 0;

  const widgetItems = charts.map((chart) => ({
    ...chart,
    key: chart.id,
    data: chartData[chart.id] ?? initialData[chart.id],
  }));

  useEffect(() => {
    if (mounted && width > 0) {
      setGridWidth(width);
    }
  }, [width, mounted]);

  const filterTags = Object.entries(filters)
    .flatMap(([chartId, values]) => {
      const config = charts.find((chart) => chart.id === chartId);
      if (!config) return null;
      return values.map((value) => ({
        chartId: chartId,
        key: value,
        title: config.title,
        value: value,
      }));
    })
    .filter(Boolean);

  const chartIdColors = Object.keys(filters).reduce((acc, chartId, index) => {
    acc[chartId] = TAG_COLOR_PALETTE[index % TAG_COLOR_PALETTE.length];
    return acc;
  }, {});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
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

  // Dynamically change widget size when charts change type
  const handleChartTypeChange = (widgetKey, chartType) => {
    const sizing = chartLayoutDefaults[chartType];

    setLayout((prev) =>
      prev.map((item) =>
        item.i === widgetKey
          ? {
              ...item,
              ...sizing,
            }
          : item,
      ),
    );
  };

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
    <div ref={containerRef} className="pt-3">
      <div
        className="d-flex flex-wrap align-items-center gap-2 px-2"
        style={{ minHeight: 40 }}
      >
        {filterTags.map((tag) => (
          <Tag
            className="c-tag--filter"
            key={tag.chartId + tag.key}
            variant="solid"
            color={chartIdColors[tag.chartId]}
            closable
            closeIcon={
              <CloseOutlined style={{ color: '#fff', fontSize: 12 }} />
            }
            onClose={() => handleRemoveFilter(tag.chartId, tag.value)}
            style={{
              paddingInline: 10,
              paddingBlock: 4,
            }}
          >
            <b>{tag.title}</b>: {tag.value}
          </Tag>
        ))}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={() => setFilters({})}>
            Clear All Filters
          </Button>
        )}
      </div>

      {mounted && gridWidth > 0 && (
        <ReactGridLayout
          dragConfig={{ enabled: true, handle: '.drag-header-handle' }}
          width={gridWidth}
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
                  onChartTypeChange={(widgetKey, chartType) =>
                    handleChartTypeChange(widgetKey, chartType)
                  }
                  layout={getWidgetLayout(item.key)}
                  onRemove={() => handleRemoveItem(item.key)}
                  isFilterable={item.isFilterable}
                  activeFilters={filters[item.key] ?? []}
                  onAddFilter={handleAddFilter}
                  onRemoveFilter={handleRemoveFilter}
                  legend={legend}
                  setLegend={setLegend}
                />
              </div>
            ))}
        </ReactGridLayout>
      )}
    </div>
  );
}
