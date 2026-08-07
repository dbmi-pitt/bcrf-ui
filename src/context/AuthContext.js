'use client';

import { logInWithGlobus, logOutOfGlobus } from '@/lib/actions/auth';
import { createContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ user, children }) => {
  const isAuthenticated = user !== null;

  useEffect(() => {
    // Refresh the page when the user navigates back to prevent stale
    // authentication state due to caching.
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
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
      window.location.href = '/';
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
