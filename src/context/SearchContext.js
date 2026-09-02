import ENVS from '@/lib/envs';
import { createContext, useEffect } from 'react';
import log from 'xac-loglevel';

const SearchContext = createContext({});

export const SearchProvider = ({ children, config }) => {


  useEffect(() => {

  }, []);

  return <SearchContext.Provider value={{
    config,
  }}>{children}</SearchContext.Provider>;
};

export default SearchContext;
