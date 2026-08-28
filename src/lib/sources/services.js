import { SUMMARY } from '@/lib/content/summaryDataSources.js';
import { connection } from '@/lib/data/database.js';
import { sourceMap } from '@/lib/sources/charts.js';
import 'server-only';

export const getSummaryDataSources = async () => {
  return SUMMARY;
};

export const getSummaryDataSource = async (dataSource) => {
  const summaryDataSource = SUMMARY.dataSources.find(
    (ds) => ds.source === dataSource,
  );
  if (!summaryDataSource) {
    return null;
  }
  return summaryDataSource;
};

export const getSourceChartConfig = async (sourceId) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return null;
  }

  // return non-client, non-data fields from charts array in config
  return {
    title: config.title,
    charts: config.charts.map(({ filter, query, data, ...rest }) => ({
      ...rest,
      isFilterable: Boolean(filter),
      filterType: filter?.type ?? null,
    })),
  };
};

export const getSourceClinicalData = async (sourceId) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return null;
  }

  const tableName = config.table;
  const result = await connection.run('SELECT * FROM ' + tableName);
  const rows = await result.getRowObjectsJson();

  return {
    data: rows,
    key: config.keyColumn,
  };
};
