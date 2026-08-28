'use server';

import { getCurrentUser } from '@/lib/auth/services.js';
import { connection } from '@/lib/data/database.js';
import { sourceMap } from '@/lib/sources/charts.js';
import { buildFilterClause } from '@/lib/sources/filter.js';
import log from 'xac-loglevel';

export const getSourceChartData = async (sourceId, filters = {}) => {
  const user = getCurrentUser();
  if (!user) {
    log.error('No user found in getSourceChartData', sourceId);
    return null;
  }

  const config = sourceMap[sourceId];
  if (!config) {
    return null;
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
