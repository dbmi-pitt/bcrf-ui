'use server';

import { DuckDBInstance } from '@duckdb/node-api';
import log from 'xac-loglevel';
import { buildFilterClause } from './filter.js';

const instance = await DuckDBInstance.create(process.env.DUCK_DB_PATH, {
  access_mode: 'READ_ONLY',
});
const connection = await instance.connect();

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    connection.closeSync();
    instance.closeSync();
    log.info('DuckDB connection closed cleanly.');
  } catch (err) {
    log.error('Error closing DuckDB connection:', err);
  }
}

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdown();
  process.exit(0);
});

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
    charts: config.charts.map(({ filter, query, data, ...rest }) => ({
      ...rest,
      isFilterable: Boolean(filter),
    })),
  };
};

// const exampleInputFilters = {
//   'cancer-type-detailed': ['Breast Invasive Ductal Carcinoma'],
//   'pathologic-stage': ['Stage IIA'],
//   'age-at-diagnosis': [50, 60],
// };

// const exampleMappedFilters = {
//   'Cancer Type Detailed': ['Breast Invasive Ductal Carcinoma'],
//   'Pathologic Stage': ['Stage IIA'],
//   'Age at Diagnosis': [50, 60],
// };

export const getChartData = async (sourceId, filters = {}) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return { notFound: true };
  }

  const cleanFilters = {};
  const mappedFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    // skip empty filters
    if (!value || !value.length || !Array.isArray(value)) {
      continue;
    }

    // find the chart config for this filter key (client sends chart id)
    const chart = config.charts.find((c) => c.id === key);
    if (!chart) {
      continue;
    }

    // skip if the chart is not filterable
    const column = chart.filter?.column;
    if (!column) {
      continue;
    }

    const filterType = chart.filter?.type;
    if (!filterType) {
      continue;
    }

    let type = null;
    switch (filterType) {
      case 'term':
        // check that the value is an array of strings
        if (!value.every((v) => typeof v === 'string')) {
          continue;
        }
        type = 'term';
        break;
      case 'range':
        // check that the value is an array of two numbers
        if (value.length !== 2 || !value.every((v) => typeof v === 'number')) {
          continue;
        }
        type = 'range';
        break;
      default:
        continue;
    }

    mappedFilters[column] = {
      type: type,
      values: value,
    };
    cleanFilters[key] = value;
  }

  // build the filter clause and query the database for each chart
  const data = {};
  for (const chart of config.charts) {
    // skip filters that are for the current chart, since we don't want to
    // filter a chart by its own values
    const filtersForChart = { ...mappedFilters };
    delete filtersForChart[chart.filter?.column];

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
