'use client';

import GridWidget from '@/components/grid/GridWidget';
import { getSourceChartData } from '@/lib/sources/actions';
import { applyFiltersToSearchParams } from '@/lib/urlFilters';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ReactGridLayout, useContainerWidth } from 'react-grid-layout';
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

  return charts.map((chart, index) => {
    const size = getChartLayout(chart);

    const item = {
      i: chart.id ?? `chart-${index}`,
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

export default function GridLayout({
  dataSource,
  charts,
  initialData,
  initialFilters,
  initialTags,
  header,
}) {
  const STORAGE_KEY = `grid-layout-${dataSource}`;
  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });
  const [gridWidth, setGridWidth] = useState(0);
  const rowHeightPx = 30;
  const margin = [10, 10];
  const cols = 12;
  const router = useRouter();
  const pathname = usePathname();

  const loadedRef = useRef(false);
  const isInitialFiltersRef = useRef(true);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [filters, setFilters] = useState(initialFilters ?? {});
  const [chartData, setChartData] = useState(initialData);
  const [layout, setLayout] = useState(() => createLayout(charts));
  const [legend, setLegend] = useState({});
  const [tags, setTags] = useState(initialTags ?? []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  const widgetItems = charts.map((chart, index) => ({
    ...chart,
    key: chart.id ?? `chart-${index}`,
    data: chartData[chart.id] ?? initialData[chart.id],
  }));

  useEffect(() => {
    if (mounted && width > 0) {
      setGridWidth(width);
    }
  }, [width, mounted]);

  const filterTags = Object.entries(tags).flatMap(([chartId, values]) => {
    return values.map((value) => ({
      chartId: chartId,
      key: `${chartId}-${value}`,
      title: charts.find((chart) => chart.id === chartId)?.title ?? chartId,
      value: value,
    }));
  });

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

  // Keep the url `filter.<chartId>` query params in sync with the current
  // filters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    applyFiltersToSearchParams(params, filters);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    // Skip the fetch on first render. Already have data from server.
    if (isInitialFiltersRef.current) {
      isInitialFiltersRef.current = false;
      return;
    }

    let cancelled = false;

    async function loadData() {
      const result = await getSourceChartData(dataSource, filters);
      if (cancelled || !result.success) {
        return;
      }
      setChartData(result.data);
      setTags(result.tags);
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [dataSource, filters, hasActiveFilters, pathname, router]);

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
    const type = charts.find((chart) => chart.id === chartId)?.filterType;
    if (!type) return;

    setFilters((prev) => {
      if (type === 'term') {
        const existing = prev[chartId] ?? [];
        if (existing.includes(value)) {
          return prev;
        }
        return { ...prev, [chartId]: [...existing, value] };
      } else if (type === 'range') {
        return { ...prev, [chartId]: value };
      }
    });
  };

  // Remove a filter value for a given chart
  const handleRemoveFilter = (chartId, value) => {
    const type = charts.find((chart) => chart.id === chartId)?.filterType;
    if (!type) return;

    setFilters((prev) => {
      if (type === 'term') {
        const existing = prev[chartId] ?? [];
        const updated = existing.filter((v) => v !== value);
        if (updated.length === 0) {
          const rest = { ...prev };
          delete rest[chartId];
          return rest;
        }
        return { ...prev, [chartId]: updated };
      } else if (type === 'range') {
        const rest = { ...prev };
        delete rest[chartId];
        return rest;
      }
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
      {header}
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
            onClose={() => handleRemoveFilter(tag.chartId, tag.value, tag.type)}
            style={{
              paddingInline: 10,
              paddingBlock: 4,
            }}
          >
            <b>{tag.title}</b>: {tag.value}
          </Tag>
        ))}
        {filterTags.length > 0 && (
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
