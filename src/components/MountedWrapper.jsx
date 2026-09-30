'use client';

import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import useGoogleTagManager from '@/hooks/useGoogleTagManager';
import '@/lib/general';
import { App } from 'antd';

function MountedWrapper({ gtmId, user, children }) {
  useGoogleTagManager(gtmId);

  return (
    <App>
      <AuthProvider user={user}>
        <AppProvider>{children}</AppProvider>
      </AuthProvider>
    </App>
  );
}

export default MountedWrapper;
