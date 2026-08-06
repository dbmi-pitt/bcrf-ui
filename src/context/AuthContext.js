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

  const logIn = async () => {
    await logInWithGlobus();
  };

  const logOut = async () => {
    await logOutOfGlobus();
    setUser(null);
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
