'use client';

import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import useGoogleTagManager from '@/hooks/useGoogleTagManager';
import '@/lib/general';
import { App } from 'antd';

function MountedWrapper({ gtmId, children }) {
  useGoogleTagManager(gtmId);

  return (
    <App>
      <AppProvider>
        <AuthProvider>{children}</AuthProvider>
      </AppProvider>
    </App>
  );
}

export default MountedWrapper;
