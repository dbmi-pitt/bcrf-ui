import URLS from './urls';
import log from 'xac-loglevel';

const API = {
  jsonHeader: (headers) => {
    headers = headers || new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  },
  fetch: async ({ url, token, body, method = 'POST' }) => {
    const headers = API.jsonHeader();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    try {
      log.debug('API.fetch', url)
      const res = await fetch(url, {
        method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        const description = contentType && contentType.includes("application/json") ? await res.json() : await res.text();
        const error = res.statusText ? res.statusText : 'An error occurred.';
        return { error, description, status: res.status };
      }
      return res.json();
    } catch (error) {
      log.error('API.fetch', error);
    }
  },
  search: async (body, index = 'entities', token) => {
    return await API.fetch({ url: `${URLS.api.search.byIndex(index)}`, body, token });
  },
  
  fetchSearchApiByField: async (values, field = 'uuid', _source = ['status', 'creation_action', 'doi_url', 'title', 'uuid'], index = 'entities') => {
    const body = {
      query: {
        bool: {
          filter: [
            {
              terms: {
                [field]: values,
              },
            },
          ],
        },
      },
      _source,
    };
    const url = URLS.api.search.byIndex(index);
    const result = await API.fetch({ url, body });
    const hits = result?.hits?.hits?.map((h) => h._source) || []
    return hits
  }
};
export default API;
