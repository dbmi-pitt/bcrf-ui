import { AntdRegistry } from '@ant-design/nextjs-registry';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MountedWrapper from '@/components/MountedWrapper';
import ENVS from '@/lib/envs';
import { headers } from 'next/headers';

export async function generateMetadata({ params }) {
  const _headers = await headers();
  const url = new URL(_headers.get('x-url'));
  const baseTitle = ENVS.app.name;
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <MountedWrapper gtmId={ENVS.gtm}>{children}</MountedWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
