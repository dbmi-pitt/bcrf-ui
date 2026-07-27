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
      filterType: filter?.type ?? null,
    })),
  };
};

// const exampleInputFilters = {
//   'cancer-type-detailed': ['Breast Invasive Ductal Carcinoma'],
//   'pathologic-stage': ['Stage IIA'],
//   'age-at-diagnosis': ['50', '60'],
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
  const tags = {};
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

    if (filterType === 'term') {
      mappedFilters[column] = {
        type: filterType,
        values: value,
      };
      cleanFilters[key] = value;
      tags[key] = value;
    } else if (filterType === 'range') {
      const labelMap = chart.bins.reduce((acc, bin) => {
        acc[bin.label] = bin.value;
        return acc;
      }, {});

      // check that all values are valid labels for this chart
      const validValues = value.filter((v) => labelMap[v] !== undefined);
      if (validValues.length === 0) {
        continue;
      }

      // special case: if only one bin is selected, we need to convert it to a range filter
      if (validValues.length === 1) {
        const binIdx = chart.bins.findIndex(
          (bin) => bin.label === validValues[0],
        );
        let values = {};
        let tagValue = '';
        if (binIdx === chart.bins.length - 1) {
          values.min = chart.bins[binIdx].value;
          tagValue = `x > ${values.min}`;
        } else if (binIdx === 0) {
          values.max = chart.bins[binIdx + 1].value;
          tagValue = `x <= ${values.max}`;
        } else {
          values.min = chart.bins[binIdx].value;
          values.max = chart.bins[binIdx + 1].value;
          tagValue = `${values.min} < x ≤ ${values.max}`;
        }
        mappedFilters[column] = {
          type: 'range',
          values: values,
        };
        cleanFilters[key] = validValues;
        tags[key] = [tagValue];
        continue;
      }

      // More than one bin selected

      // convert labels to the index values for the bins
      const binIdxs = validValues
        .map((v) => chart.bins.findIndex((bin) => bin.label === v))
        .sort((a, b) => a - b);

      const lowerBin = chart.bins[binIdxs[0]];
      const upperBin = chart.bins[binIdxs[binIdxs.length - 1]];

      const lowerValue =
        lowerBin.label.includes('>') || lowerBin.label.includes('<')
          ? undefined
          : lowerBin.value;

      let upperValue = undefined;
      if (!upperBin.label.includes('>') && !upperBin.label.includes('<')) {
        upperValue = chart.bins[binIdxs[binIdxs.length - 1] + 1]?.value;
      }

      mappedFilters[column] = {
        type: 'range',
        values: {
          min: lowerValue,
          max: upperValue,
        },
      };
      cleanFilters[key] = validValues;

      let tagValue = '';
      if (lowerValue !== undefined && upperValue !== undefined) {
        tagValue = `${lowerValue} < x ≤ ${upperValue}`;
      } else if (lowerValue !== undefined && upperValue === undefined) {
        tagValue = `x > ${lowerValue}`;
      } else if (lowerValue === undefined && upperValue !== undefined) {
        tagValue = `x ≤ ${upperValue}`;
      }
      tags[key] = [tagValue];
    }
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
    log.debug(`Querying chart ${chart.id}:`, query, params);
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

  log.debug('Tags:', tags);
  return {
    data: data,
    filters: cleanFilters,
    tags: tags,
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
