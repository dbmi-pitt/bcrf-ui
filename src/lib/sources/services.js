import { getConnection } from '@/lib/data/database-puck.js';
import { connection } from '@/lib/data/database.js';
import { sourceMap } from '@/lib/sources/charts.js';
import 'server-only';

export const getSummaryDataSource = async (dataSource) => {
  const conn = await getConnection();
  const result = await conn.run(
    'SELECT source, name, description, data FROM sources WHERE source = $source',
    { source: dataSource },
  );
  const rows = await result.getRowObjectsJson();
  if (rows.length === 0) {
    return null;
  }
  return {
    ...JSON.parse(rows[0].data),
    source: rows[0].source,
    name: rows[0].name,
    description: rows[0].description,
  };
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
