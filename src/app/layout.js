import { AntdRegistry } from '@ant-design/nextjs-registry';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './main.css';
import MountedWrapper from '@/components/MountedWrapper';
import ENVS from '@/lib/envs';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/actions/auth';

export async function generateMetadata() {
  const _headers = await headers();
  const rawUrl = _headers.get('x-url');
  const baseTitle = ENVS.app.name;

  if (!rawUrl) {
    return { title: baseTitle };
  }

  const url = new URL(rawUrl);
  const pageParts = url.pathname.split('/');
  let pageTitle = pageParts[1]?.toTitleCase();
  pageTitle = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;

  return {
    title: {
      default: pageTitle,
      template: `%s | ${baseTitle}`,
    },
  };
}

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <MountedWrapper gtmId={ENVS.gtm} user={currentUser}>
            {children}
          </MountedWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
