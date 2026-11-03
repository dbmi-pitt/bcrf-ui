import { AntdRegistry } from '@ant-design/nextjs-registry';

import MountedWrapper from '@/components/MountedWrapper';
import { getCurrentUser } from '@/lib/auth/services';
import ENVS, { getLogLevel } from '@/lib/envs';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import CookieConsentBanner from '@/components/CookieConsent';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

export async function generateMetadata() {
  return {
    title: {
      default: ENVS.app.name,
      template: `%s | ${ENVS.app.name}`,
    },
  };
}

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <MountedWrapper
            gtmId={ENVS.gtm}
            logLevel={getLogLevel()}
            user={currentUser}
          >
            <CookieConsentBanner />
            {children}
          </MountedWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
