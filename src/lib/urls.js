import log from 'xac-loglevel';
import { getAppBaseUrl, getContentBannerUrl } from '@/lib/envs';

const URLS = {
   api: {
    local: (path) => `/api/${path}`,
   },
   get base() {
      return getAppBaseUrl();
   },
   content: {
      locale: {
         get base() {
            return `${getAppBaseUrl()}content/locale/`;
         },
      },
      get banner() {
         return getContentBannerUrl() ||
            `${getAppBaseUrl()}content/banner.json`;
      },
      get summary() {
         return `${getAppBaseUrl()}content/summary-data-sources.json`;
      },
   }
};

export default URLS;
