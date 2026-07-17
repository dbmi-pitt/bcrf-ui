'use server';

import { DuckDBInstance } from '@duckdb/node-api';
import { buildFilterClause } from './filter.js';

const instance = await DuckDBInstance.create(process.env.DUCK_DB_PATH, {
  access_mode: 'READ_ONLY',
});
const connection = await instance.connect();

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
    charts: config.charts.map(({ filterColumn, query, ...rest }) => ({
      isFilterable: Boolean(filterColumn),
      ...rest,
    })),
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

  const cleanFilters = {};
  const mappedFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    // skip empty filters
    if (!value || !value.length) {
      continue;
    }

    // find the chart config for this filter key (client sends chart id)
    const chart = config.charts.find((c) => c.id === key);
    if (!chart) {
      continue;
    }

    // skip if the chart is not filterable
    const column = chart.filterColumn;
    if (!column) {
      continue;
    }

    mappedFilters[column] = value;
    cleanFilters[key] = value;
  }

  // if no valid mapped filters, return the chart data without filtering
  if (!mappedFilters || !Object.keys(mappedFilters).length) {
    return {
      data: config.charts.map(({ id, data }) => ({ id: id, data: data })),
      filters: {},
    };
  }

  // build the filter clause and query the database for each chart
  const { clause, params } = buildFilterClause(mappedFilters);
  const data = [];
  for (const chart of config.charts) {
    const query = chart.query(clause);
    const result = await connection.query(query, params);
    data.push({ id: chart.id, data: result });
  }

  return {
    data: data,
    filters: cleanFilters,
  };
};
