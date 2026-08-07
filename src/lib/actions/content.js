'use server';

import { CONTENT as aboutHubContent } from '@/lib/content/locale/en/about/hub.js';
import { CONTENT as aboutPartnershipContent } from '@/lib/content/locale/en/about/partnership.js';
import { CONTENT as indexContent } from '@/lib/content/locale/en/index.js';

export const getLocale = async (path) => {
  switch (path) {
    case '/':
    case '/index':
      return indexContent;
    case '/about/hub':
      return aboutHubContent;
    case '/about/partnership':
      return aboutPartnershipContent;
    default:
      throw new Error(`No locale content found for path: ${path}`);
  }
};
