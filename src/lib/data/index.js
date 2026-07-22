'use server';

import { DuckDBInstance } from '@duckdb/node-api';
import log from 'xac-loglevel';
import { buildFilterClause } from './filter.js';

const instance = await DuckDBInstance.create(process.env.DUCK_DB_PATH, {
  access_mode: 'READ_ONLY',
});
const connection = await instance.connect();

const sourceMap = {
  'aurora-us': (await import('./config/auroraUS.js')).CONFIG,
  'aurora-eu': (await import('./config/auroraEU.js')).CONFIG,
};

export const getChartConfig = async (sourceId) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return { notFound: true };
  }

  // return non-client, non-data fields from charts array in config
  return {
    charts: config.charts.map(({ filterColumn, query, data, ...rest }) => ({
      ...rest,
      isFilterable: Boolean(filterColumn),
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

export const getChartData = async (sourceId, filters = {}) => {
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
    const data = {};
    for (const chart of config.charts) {
      data[chart.id] = chart.data;
    }
    return {
      data: data,
      filters: {},
    };
  }

  // build the filter clause and query the database for each chart
  const data = {};
  for (const chart of config.charts) {
    // skip filters that are for the current chart, since we don't want to
    // filter a chart by its own values
    const filtersForChart = { ...mappedFilters };
    delete filtersForChart[chart.filterColumn];

    const { clause, params } = buildFilterClause(filtersForChart);
    const query = chart.query(clause).replace(/\s+/g, ' ').trim();
    try {
      const result = await connection.run(query, params);
      const rows = await result.getRowObjectsJson();
      data[chart.id] = rows;
    } catch (error) {
      data[chart.id] = [];
      log.error(`Error querying chart ${chart.id}:`, error);
      continue;
    }
  }

  return {
    data: data,
    filters: cleanFilters,
  };
};

export const getAllClinicalData = async (sourceId) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return { notFound: true };
  }

  const tableName = config.table;
  const result = await connection.run('SELECT * FROM ' + tableName);
  const rows = await result.getRowObjectsJson();

  return {
    data: rows,
    key: config.keyColumn,
  };
};
