'use server';

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
