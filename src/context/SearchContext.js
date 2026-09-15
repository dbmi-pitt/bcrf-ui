import { createContext, useState } from 'react';

const SearchContext = createContext({});

export const SearchProvider = ({ children, config }) => {
  const [facets, setFacets] = useState(config.aggregations || {});
  const [selectedFacets, setSelectedFacets] = useState(undefined);

  return (
    <SearchContext.Provider
      value={{
        config,
        facets,
        setFacets,
        selectedFacets,
        setSelectedFacets,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
