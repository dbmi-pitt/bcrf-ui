import ENVS from '@/lib/envs';
import { createContext, useEffect, useState } from 'react';
import log from 'xac-loglevel';

const SearchContext = createContext({});

export const SearchProvider = ({ children, config }) => {
  const [facets, setFacets] = useState(undefined); 

  useEffect(() => {

  }, []);

  return <SearchContext.Provider value={{
    config,
    facets,
    setFacets,
  }}>{children}</SearchContext.Provider>;
};

export default SearchContext;
