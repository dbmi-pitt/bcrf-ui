'use server';

import { getConnection } from '@/lib/data/database';
import { getSourcesByIds } from '@/lib/database/sources';
import { GLOBAL_SOURCE, PERMISSION } from '@/lib/permission/constants';
import {
  hasCurrentUserGlobalReadPermission,
  hasCurrentUserPermission,
} from '@/lib/permission/services';
import { sourceMap } from '@/lib/sources/charts';
import { buildFilterClause } from '@/lib/sources/filter';
import log from 'xac-loglevel';

export const getSourceChartData = async (sourceId, filters = {}) => {
  const authorized = await hasCurrentUserPermission(sourceId, PERMISSION.READ);
  if (!authorized) {
    log.error(`User does not have Globus read permission for ${sourceId}`);
    return {
      success: false,
      error: 'User does not have permission to view data',
    };
  }

  const config = sourceMap[sourceId];
  if (!config) {
    return {
      success: false,
      error: `No chart config found for source ${sourceId}`,
    };
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
      const connection = await getConnection();
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
    success: true,
    data: data,
    filters: cleanFilters,
    tags: tags,
  };
};

const TABLE_NAME = 'combined_source_data';

// Columns that are not not facets. Don't aggregate
const EXCLUDED_FROM_AGGREGATIONS = new Set([
  'Source',
  'Source Record ID',
  'Patient ID',
]);

const SOURCE_COLUMN = 'Source';

let allColumnsCache = null;

async function getAllColumns() {
  if (allColumnsCache) return allColumnsCache;

  const connection = await getConnection();
  const result = await connection.run(
    `
    SELECT column_name FROM information_schema.columns
    WHERE table_name = ? ORDER BY ordinal_position
    `,
    [TABLE_NAME],
  );
  const rows = await result.getRowObjectsJson();
  allColumnsCache = rows.map((row) => row.column_name);
  return allColumnsCache;
}

export const getAllSummaryDataAggregations = async (filters = {}) => {
  const authorized = await hasCurrentUserGlobalReadPermission();
  if (!authorized) {
    log.error(`User does not have global read permission for summary data`);
    return {
      success: false,
      error: 'User does not have permission to view summary data',
    };
  }

  const result = await getSummaryDataAggregations(filters);
  if (!result.success) {
    return result;
  }

  const countsBySource = new Map(result.sources.map((s) => [s.source, s]));

  // only fetch sources that have samples matching the current filters
  const activeSourceIds = result.sources
    .filter((s) => s.samples > 0)
    .map((s) => s.source);

  const dbSources = await getSourcesByIds(activeSourceIds, [
    'source',
    'name',
    'description',
    'patient_count',
    'sample_count',
    'data_table_name',
  ]);

  const sources = [];
  for (const s of dbSources) {
    const counts = countsBySource.get(s.source);

    sources.push({
      source: s.source,
      name: s.name,
      description: s.description,
      totalPatientCount: s.patient_count,
      totalSampleCount: s.sample_count,
      patientCount: counts?.patients ?? 0,
      sampleCount: counts?.samples ?? 0,
      tags: await getSourceTags(s.source, s.data_table_name),
    });
  }

  return {
    success: true,
    aggregations: result.aggregations,
    sources: sources,
  };
};

const sourceTagsCache = new Map();

const getSourceTags = async (source, tableName) => {
  if (sourceTagsCache.has(source)) {
    return sourceTagsCache.get(source);
  }

  const config = sourceMap[source];
  if (!config) {
    return {};
  }

  const tagColumns = config.charts
    .map(({ id, filter, title }) => {
      if (filter && filter.type === 'term') {
        return {
          id: id,
          title: title,
          column: filter.column,
        };
      }
      return null;
    })
    .filter(Boolean);

  if (tagColumns.length === 0) {
    return {};
  }

  // One subquery per column, unioned together so this is a single query
  const subQueries = tagColumns.map(({ id, column }) => {
    const label = id.replace(/'/g, "''");
    return `
      SELECT '${label}' AS id, "${column}" AS tag
      FROM ${tableName}
      WHERE "${column}" IS NOT NULL
      GROUP BY tag
    `;
  });

  const query = `
    SELECT id, tag
    FROM (${subQueries.join(' UNION ALL ')})
    ORDER BY id, tag
  `
    .replace(/\s+/g, ' ')
    .trim();

  const tags = {};
  for (const { id, title } of tagColumns) {
    tags[id] = { title: title, values: [] };
  }

  try {
    const connection = await getConnection();
    const result = await connection.run(query);
    const rows = await result.getRowObjectsJson();
    for (const row of rows) {
      tags[row.id].values.push(row.tag);
    }
  } catch (error) {
    log.error(`Error querying tags for source ${source}:`, error);
    return {};
  }

  sourceTagsCache.set(source, tags);
  return tags;
};

/**
 * Returns term aggregations for combined data sources.
 *
 * @param {Object.<string, string[]>} [filters] - Map of allowed column name to
 * an array of values.
 *   Example: { 'Sex': ['Female'], 'Sample Type': ['Primary', 'Metastatic'] }
 *
 * @returns {Promise<
 *   | {
 *       success: true,
 *       aggregations: Object.<string, { term: string, count: number }[]>,
 *       sources: { source: string, patients: number, samples: number }[]
 *     }
 *   | { success: false, error: string }
 * >}
 */
const getSummaryDataAggregations = async (filters = {}) => {
  let allColumns;
  try {
    allColumns = await getAllColumns();
  } catch (error) {
    log.error('Error fetching table columns:', error);
    return { success: false, error: 'Failed to load columns' };
  }
  const aggregationColumns = allColumns.filter(
    (c) => !EXCLUDED_FROM_AGGREGATIONS.has(c),
  );

  const mappedFilters = {};
  for (const [key, value] of Object.entries(filters)) {
    if (!value || !value.length || !Array.isArray(value)) continue;
    if (!aggregationColumns.includes(key)) continue;
    mappedFilters[key] = { type: 'term', values: value };
  }

  // Build a separate subquery per facet column, exclude that column's own
  // filter so a facet is never filtered by its own selected values.
  const subQueries = [SOURCE_COLUMN, ...aggregationColumns].map(
    (column, idx) => {
      const label = column.replace(/'/g, "''");

      const filtersForColumn = { ...mappedFilters };
      delete filtersForColumn[column];
      const { clause, params: columnParams } =
        buildFilterClause(filtersForColumn);

      const renamedParams = {};
      let renamedClause = clause;
      for (const [name, value] of Object.entries(columnParams)) {
        const uniqueName = `q${idx}_${name}`;
        renamedParams[uniqueName] = value;
        renamedClause = renamedClause.replace(
          new RegExp(`\\$${name}\\b`, 'g'),
          `$${uniqueName}`,
        );
      }

      const whereSql = renamedClause ? `WHERE ${renamedClause}` : '';

      const isSourceColumn = column === SOURCE_COLUMN;
      const sourceCounts = isSourceColumn
        ? `
          COUNT(DISTINCT "Patient ID") AS patients,
          COUNT(DISTINCT "Source Record ID") AS samples
        `
        : 'NULL AS patients, NULL AS samples';

      return {
        sql: `
        SELECT
          '${label}' AS column_name,
          "${column}" AS term,
          COUNT(*) AS count,
          ${sourceCounts}
        FROM ${TABLE_NAME}
        ${whereSql}
        GROUP BY term`,
        params: renamedParams,
      };
    },
  );

  const query = `
    SELECT column_name, term, count, patients, samples
    FROM (${subQueries.map((s) => s.sql).join(' UNION ALL ')})
    ORDER BY column_name, count DESC
  `
    .replace(/\s+/g, ' ')
    .trim();

  const params = subQueries.reduce(
    (acc, s) => Object.assign(acc, s.params),
    {},
  );

  const sources = [];
  const aggs = {};
  for (const column of aggregationColumns) {
    aggs[column] = [];
  }

  log.debug('Querying summary aggregations:', query, params);
  try {
    const connection = await getConnection();
    const result = await connection.run(query, params);
    const rows = await result.getRowObjectsJson();
    for (const row of rows) {
      if (row.column_name === SOURCE_COLUMN) {
        if (row.term === GLOBAL_SOURCE) continue;
        sources.push({
          source: row.term,
          patients: Number(row.patients),
          samples: Number(row.samples),
        });
      } else {
        aggs[row.column_name].push({
          term: row.term,
          count: Number(row.count),
        });
      }
    }
  } catch (error) {
    log.error('Error querying summary aggregations:', error);
    return { success: false, error: 'Failed to query aggregations' };
  }

  return {
    success: true,
    aggregations: aggs,
    sources: sources,
  };
};
