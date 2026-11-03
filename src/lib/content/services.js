import { CONTENT as aboutHubContent } from '@/lib/content/locale/en/about/hub.js';
import { CONTENT as aboutPartnershipContent } from '@/lib/content/locale/en/about/partnership.js';
import { CONTENT as indexContent } from '@/lib/content/locale/en/index.js';
import { CONTENT as termsContent } from '@/lib/content/locale/en/terms-and-conditions';
import { CONTENT as privacyContent } from '@/lib/content/locale/en/privacy-policy';
import URLS from '@/lib/urls';
import 'server-only';

export const getBannerContent = async () => {
  const url = URLS.content.banner;
  if (!url) {
    return null;
  }
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
    case '/terms-and-conditions':
      return termsContent;
    case '/privacy-policy':
      return privacyContent;
    default:
      return null;
  }
};
