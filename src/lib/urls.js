import log from 'xac-loglevel';

const URLS = {
   api: {
    local: (path) => `/api/${path}`,
   },
   content: {
      banner: process.env.NEXT_PUBLIC_CONTENT_BANNER_URL ||
    `${process.env.NEXT_PUBLIC_APP_BASE_URL}content/banner.json`,
      summary: `${process.env.NEXT_PUBLIC_APP_BASE_URL}content/summary-data-sources.json`
   }
};

export default URLS;
