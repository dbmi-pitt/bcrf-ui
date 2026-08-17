'use server';

import { CONTENT as aboutHubContent } from '@/lib/content/locale/en/about/hub.js';
import { CONTENT as aboutPartnershipContent } from '@/lib/content/locale/en/about/partnership.js';
import { CONTENT as indexContent } from '@/lib/content/locale/en/index.js';
import URLS from '@/lib/urls';

export const getBannerContent = async () => {
  const url = URLS.content.banner;
  const results = await fetch(url, { method: 'GET' });
  if (!results.ok) {
    return { status: 'not_found', message: 'Banner content not found' };
  }

  const data = await results.json();
  if (!data) {
    return { status: 'not_found', message: 'Banner content not found' };
  }

  return { status: 'success', data: data };
};

export const getHomeContent = async (path) => {
  switch (path) {
    case '/':
    case '/index':
      return { status: 'success', data: indexContent };
    case '/about/hub':
      return { status: 'success', data: aboutHubContent };
    case '/about/partnership':
      return { status: 'success', data: aboutPartnershipContent };
    default:
      return {
        status: 'not_found',
        message: `No locale content found for path: ${path}`,
      };
  }
};
