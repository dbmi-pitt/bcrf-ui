import ContentGenerator from '@/components/ContentGenerator';
import BleedLayout from '@/components/layout/BleedLayout';
import { getBannerContent, getHomeContent } from '@/lib/content/services';

export default async function AppPage({ path }) {
  const content = await getHomeContent(path);
  const bannerContent = await getBannerContent(path);

  return (
    <BleedLayout bannerContent={bannerContent || {}}>
      <ContentGenerator content={content} />
    </BleedLayout>
  );
}
