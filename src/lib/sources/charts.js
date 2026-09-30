import 'server-only';

export const sourceMap = {
  'aurora-us': (await import('@/lib/sources/config/auroraUS.js')).CONFIG,
  'aurora-eu': (await import('@/lib/sources/config/auroraEU.js')).CONFIG,
  'upmc-ehr-bc-data-mart': (await import('@/lib/sources/config/upmcEHRDataMart')).CONFIG,
};
