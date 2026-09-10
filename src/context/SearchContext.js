import { createContext, useState } from 'react';

const SearchContext = createContext({});

export const SearchProvider = ({ children, config, aggregations }) => {
  const [facets, setFacets] = useState(config.aggregations || {});
  const [selectedFacets, setSelectedFacets] = useState(undefined);
  const [activeSources, setActiveSources] = useState(
    config.activeSources || config.sources.map(({ source }) => source),
  );

  const updateActiveSources = (sourceNames) => {
    setActiveSources(sourceNames);
    const activeNames = new Set(sourceNames.map(({ source }) => source));
    const filteredNames = config.sources.filter(({ source }) =>
      activeNames.has(source),
    );
    config.setCards(filteredNames);
  };

  return (
    <SearchContext.Provider
      value={{
        config,
        facets,
        setFacets,
        selectedFacets,
        setSelectedFacets,
        activeSources,
        setActiveSources: updateActiveSources,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
