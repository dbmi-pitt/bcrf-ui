'use client';

import {
  getCurrentUser,
  logInWithGlobus,
  logOutOfGlobus,
} from '@/lib/actions/auth';
import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isAuthenticated = user !== null;

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadData();
  }, []);

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
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
