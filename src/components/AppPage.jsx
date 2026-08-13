import ContentGenerator from '@/components/ContentGenerator';
import BleedLayout from '@/components/layout/BleedLayout';
import { getLocale } from '@/lib/actions/content.js';
import { getBannerContent } from '@/lib/actions/home.js';

export default async function AppPage({ path }) {
  const content = await getLocale(path);
  const bannerResult = await getBannerContent(path);

  return (
    <BleedLayout bannerContent={bannerResult.data || {}}>
      <ContentGenerator content={content} />
    </BleedLayout>
  );
}
