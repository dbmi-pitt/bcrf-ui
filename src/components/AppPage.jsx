import ContentGenerator from '@/components/ContentGenerator';
import BleedLayout from '@/components/layout/BleedLayout';
import { getLocale } from '@/lib/actions/content.js';

export default async function AppPage({ path }) {
  const content = await getLocale(path);

  return (
    <div>
      <BleedLayout>
        <ContentGenerator content={content} />
      </BleedLayout>
    </div>
  );
}
