import { getSource, getSources } from '@/lib/database/sources';
import { sourceMap } from '@/lib/sources/charts';
import 'server-only';

export const getSummaryDataSources = async () => {
  const sources = await getSources([
    'source',
    'name',
    'description',
    'patient_count',
    'sample_count',
  ]);

  return sources.map(
    ({ source, name, description, patient_count, sample_count }) => ({
      source: source,
      name: name,
      description: description,
      patientCount: patient_count,
      sampleCount: sample_count,
      dataTypes: sourceMap[source]?.dataTypes || [],
      tags: [],
    }),
  );
};

export const getSummaryDataSource = async (source) => {
  const row = await getSource(source, [
    'source',
    'name',
    'description',
    'patient_count',
    'sample_count',
  ]);
  const charts = sourceMap[source];
  if (!row || !charts) {
    return null;
  }

  return {
    source: row.source,
    name: row.name,
    description: row.description,
    patientCount: row.patient_count,
    sampleCount: row.sample_count,
    dataTypes: charts.dataTypes || [],
    tags: [],
  };
};

export const getSourceChartConfig = async (source) => {
  const row = await getSource(source, ['name']);
  const config = sourceMap[source];
  if (!row || !row.name || !config) {
    return null;
  }

  // return non-client, non-data fields from charts array in config
  return {
    title: row.name,
    charts: config.charts.map(({ filter, query, data, ...rest }) => ({
      ...rest,
      isFilterable: Boolean(filter),
      filterType: filter?.type ?? null,
    })),
  };
};

export const getSourceClinicalData = async (source) => {
  const row = await getSource(source, ['data_table_name', 'key_column']);
  if (!row || !row.data_table_name || !row.key_column) {
    return null;
  }

  const tableName = row.data_table_name;
  const result = await connection.run('SELECT * FROM ' + tableName);
  const rows = await result.getRowObjectsJson();

  return {
    data: rows,
    key: row.key_column,
  };
};
