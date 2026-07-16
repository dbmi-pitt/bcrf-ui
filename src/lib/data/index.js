'use server';

import { buildFilterClause } from './filter.js';

const sourceMap = {
  'aurora-us': (await import('./config/auroraUS.js')).CONFIG,
  'aurora-eu': (await import('./config/auroraEU.js')).CONFIG,
};

export const getChartData = async (sourceId) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return { notFound: true };
  }

  // return non-client fields from charts array in config
  return {
    charts: config.charts.map(({ filterColumn, query, ...rest }) => rest),
  };
};

const exampleInputFilters = {
  'cancer-type-detailed': ['Breast Invasive Ductal Carcinoma'],
  'pathologic-stage': ['Stage IIA'],
};

const exampleMappedFilters = {
  'Cancer Type Detailed': ['Breast Invasive Ductal Carcinoma'],
  'Pathologic Stage': ['Stage IIA'],
};

export const getFilteredChartData = async (sourceId, filters) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return { notFound: true };
  }

  const mappedFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    // skip empty filters
    if (!value || !value.length) {
      continue;
    }

    // find the chart config for this filter key
    const chart = config.charts.find((c) => c.filterColumn === key);
    if (!chart) {
      continue;
    }

    // skip if the chart if not filterable
    const column = chart.filterColumn;
    if (!column) {
      continue;
    }

    mappedFilters[column] = value;
  }

  // if no valid mapped filters, return the chart data without filtering
  if (!mappedFilters || !Object.keys(mappedFilters).length) {
    return {
      data: config.charts.map(({ id, data }) => ({ id, data })),
      filters: {},
    };
  }

  const { clause, params } = buildFilterClause(mappedFilters);
};
