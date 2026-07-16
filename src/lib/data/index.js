'use server';

const sourceMap = {
  aurora_us: (await import('./config/auroraUS.js')).CONFIG,
  aurora_eu: (await import('./config/auroraEU.js')).CONFIG,
};

export const getChartData = async (sourceId) => {
  const config = sourceMap[sourceId];
  if (!config) {
    return { notFound: true };
  }

  // return non-client fields from charts array in config
  return {
    charts: config.charts.map(({ filterColumn, query, ...rest }) => rest),
  };
};
