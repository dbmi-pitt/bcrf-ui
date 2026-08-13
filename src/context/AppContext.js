import ENVS from '@/lib/envs';
import { createContext, useEffect } from 'react';
import log from 'xac-loglevel';

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const setLoglevel = async () => {
    log.setLevel(ENVS.logLevel);
  };

  useEffect(() => {
    setLoglevel();
  }, []);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppContext;
