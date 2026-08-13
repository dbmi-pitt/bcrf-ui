import ContentGenerator from '@/components/ContentGenerator';
import BleedLayout from '@/components/layout/BleedLayout';
import { getBannerContent, getHomeContent } from '@/lib/actions/home';

export default async function AppPage({ path }) {
  const contentResult = await getHomeContent(path);
  const bannerResult = await getBannerContent(path);

  return (
    <BleedLayout bannerContent={bannerResult.data || {}}>
      <ContentGenerator content={contentResult.data} />
    </BleedLayout>
  );
}
