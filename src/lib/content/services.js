import { CONTENT as aboutHubContent } from '@/lib/content/locale/en/about/hub.js';
import { CONTENT as aboutPartnershipContent } from '@/lib/content/locale/en/about/partnership.js';
import { CONTENT as indexContent } from '@/lib/content/locale/en/index.js';
import URLS from '@/lib/urls';
import 'server-only';

export const getBannerContent = async () => {
  const url = URLS.content.banner;
  const results = await fetch(url, { method: 'GET' });
  if (!results.ok) {
    return null;
  }

  const data = await results.json();
  if (!data) {
    return null;
  }

  return data;
};

export const getHomeContent = async (path) => {
  switch (path) {
    case '/':
    case '/index':
      return indexContent;
    case '/about/hub':
      return aboutHubContent;
    case '/about/partnership':
      return aboutPartnershipContent;
    default:
      return null;
  }
};
