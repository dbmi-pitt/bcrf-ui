'use server';

import { getCurrentUser } from '@/lib/auth/services.js';
import { getConnection } from '@/lib/data/database-puck.js';
import { connection } from '@/lib/data/database.js';
import { sourceMap } from '@/lib/sources/charts.js';
import { buildFilterClause } from '@/lib/sources/filter.js';
import log from 'xac-loglevel';

export const getSourceChartData = async (sourceId, filters = {}) => {
  const user = getCurrentUser();
  if (!user) {
    log.error('No user found in getSourceChartData', sourceId);
    return { success: false, error: 'User not authenticated' };
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
const SAMPLE_ID_COLUMN = 'Source Record ID';
const PATIENT_ID_COLUMN = 'Patient ID';

let allColumnsCache = null;

async function getAllColumns() {
  if (allColumnsCache) return allColumnsCache;

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
 *       sources: {
 *         source: string,
 *         samples: number,
 *         patients: number,
 *         name: string,
 *         description?: string,
 *         [key: string]: any
 *       }[]
 *     }
 *   | { success: false, error: string }
 * >}
 */
export const getSummaryDataSources = async (filters = {}) => {
  const user = getCurrentUser();
  if (!user) {
    log.error('No user found in getSummaryDataSources');
    return { success: false, error: 'User not authenticated' };
  }

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

  const { clause, params } = buildFilterClause(mappedFilters);
  const whereSql = clause ? `WHERE ${clause}` : '';
  const subQueries = [SOURCE_COLUMN, ...aggregationColumns].map((column) => {
    const label = column.replace(/'/g, "''");
    if (column === SOURCE_COLUMN) {
      return `
        SELECT
          '${label}' AS column_name,
          "${column}" AS term,
          COUNT(*) AS count,
          COUNT(DISTINCT "${SAMPLE_ID_COLUMN}") AS samples,
          COUNT(DISTINCT "${PATIENT_ID_COLUMN}") AS patients
        FROM filtered
        GROUP BY term
        `;
    }
    return `
      SELECT
        '${label}' AS column_name,
        "${column}" AS term,
        COUNT(*) AS count,
        NULL AS samples,
        NULL AS patients
      FROM filtered
      GROUP BY term`;
  });

  const query = `
    WITH filtered AS (
      SELECT * FROM ${TABLE_NAME} ${whereSql}
    )
    SELECT column_name, term, count, samples, patients
    FROM (${subQueries.join(' UNION ALL ')})
    ORDER BY column_name, count DESC
  `
    .replace(/\s+/g, ' ')
    .trim();

  const sources = {};
  const aggs = {};
  for (const column of aggregationColumns) {
    aggs[column] = [];
  }

  log.debug('Querying summary aggregations:', query, params);
  try {
    const result = await connection.run(query, params);
    const rows = await result.getRowObjectsJson();
    for (const row of rows) {
      if (row.column_name === SOURCE_COLUMN) {
        sources[row.term] = {
          count: row.count,
          samples: row.samples,
          patients: row.patients,
        };
      } else {
        aggs[row.column_name].push({ term: row.term, count: row.count });
      }
    }
  } catch (error) {
    log.error('Error querying summary aggregations:', error);
    return { success: false, error: 'Failed to query aggregations' };
  }

  const activeSources = {};
  for (const [source, stats] of Object.entries(sources)) {
    if (stats.count > 0) {
      const { count, ...rest } = stats;
      activeSources[source] = { source, ...rest };
    }
  }

  const sourceIds = Object.keys(activeSources);
  if (sourceIds.length > 0) {
    const placeholders = sourceIds.map(() => '?').join(', ');
    const sourceQuery = `
      SELECT source, name, description, data FROM sources
      WHERE source IN (${placeholders}) AND NOT virtual
    `
      .replace(/\s+/g, ' ')
      .trim();
    try {
      const puckConnection = await getConnection();
      log.debug('Querying source metadata:', sourceQuery, sourceIds);
      const puckResult = await puckConnection.run(sourceQuery, sourceIds);
      const puckRows = await puckResult.getRowObjectsJson();
      for (const row of puckRows) {
        const stats = activeSources[row.source];
        let metadata = row.data;
        if (typeof metadata === 'string') {
          try {
            metadata = JSON.parse(metadata);
          } catch (parseError) {
            log.error(
              `Invalid metadata JSON for source ${row.source}:`,
              parseError,
            );
            metadata = {};
          }
        }
        Object.assign(stats, metadata, {
          name: row.name,
          description: row.description,
          samples: stats.samples,
          patients: stats.patients,
        });
      }
    } catch (error) {
      log.error('Error querying source metadata:', error);
      return { success: false, error: 'Failed to query source metadata' };
    }
  }

  return {
    success: true,
    aggregations: aggs,
    sources: Object.values(activeSources),
  };
};
