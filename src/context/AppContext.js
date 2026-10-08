import { createContext, useEffect } from 'react';
import log from 'xac-loglevel';

const AppContext = createContext({});

export const AppProvider = ({ logLevel, children }) => {
  const setLoglevel = async () => {
    log.setLevel(logLevel);
  };

  useEffect(() => {
    setLoglevel();
  }, []);

  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};

export default AppContext;
