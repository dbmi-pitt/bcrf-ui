// Filters are stored in the URL as repeated 'filter.<chartId>=<value>'
export const FILTER_PARAM_PREFIX = 'filter.';

export function parseFiltersFromSearchParams(searchParams) {
  const filters = {};

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (!key.startsWith(FILTER_PARAM_PREFIX)) {
      continue;
    }
    const chartId = key.slice(FILTER_PARAM_PREFIX.length);
    if (!chartId) {
      continue;
    }
    filters[chartId] = Array.isArray(value) ? value : [value];
  }

  return filters;
}

export function applyFiltersToSearchParams(params, filters) {
  for (const key of [...params.keys()]) {
    if (key.startsWith(FILTER_PARAM_PREFIX)) {
      params.delete(key);
    }
  }

  for (const [chartId, values] of Object.entries(filters)) {
    for (const value of values) {
      params.append(`${FILTER_PARAM_PREFIX}${chartId}`, value);
    }
  }

  return params;
}
