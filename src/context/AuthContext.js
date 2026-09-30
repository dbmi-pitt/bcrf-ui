'use client';

import { logInWithGlobus, logOutOfGlobus } from '@/lib/auth/actions';
import { isProtectedPath } from '@/lib/auth/paths';
import { hasCurrentUserGlobalReadPermission } from '@/lib/permission/actions';
import { createContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ user, children }) => {
  const isAuthenticated = user !== null;

  useEffect(() => {
    const handlePageShow = async (event) => {
      // This addresses an issue when the user presses the back button after
      // logging out. We don't want to show the protected page.
      if (!event.persisted) {
        return;
      }
      if (!isProtectedPath(window.location.pathname)) {
        return;
      }

      hasCurrentUserGlobalReadPermission()
        .then((hasPermission) => {
          if (hasPermission) {
            return;
          }

          // Redirect to login if the user is not authenticated or lacks permission.
          const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
          url.searchParams.set('from', window.location.pathname);
          window.location.replace(url.toString());
        })
        .catch(console.error);

      // Redirect to login if the user is not authenticated or lacks permission.
      const url = new URL('/login', process.env.NEXT_PUBLIC_APP_BASE_URL);
      url.searchParams.set('from', window.location.pathname);
      window.location.replace(url.toString());
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const logIn = async () => {
    await logInWithGlobus();
  };

  const logOut = async () => {
    try {
      await logOutOfGlobus();
    } finally {
      window.location.replace('/');
    }
  };

  const redirectToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logIn,
        logOut,
        redirectToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
