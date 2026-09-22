import { getAllSummaryDataAggregations } from '@/lib/sources/actions';
import { createContext, useState } from 'react';
import log from 'xac-loglevel';

const SearchContext = createContext({});

const selectedFacetsFromCheckedKeys = (aggregations, checkedKeys) => {
  const selected = [];
  for (const facet in aggregations) {
    for (const { term } of aggregations[facet]) {
      const key = `${facet.toDashedCase()}-${term.toDashedCase()}`;
      if (checkedKeys.indexOf(key) !== -1) {
        selected.push(key);
      }
    }
  }
  return selected;
};

export const SearchProvider = ({ children, config }) => {
  const [cards, setCards] = useState(config.sources);
  const [facets, setFacets] = useState(config.aggregations || {});
  const [selectedFacets, setSelectedFacets] = useState(undefined);
  const [isBusy, setIsBusy] = useState(false);

  const applyFilters = async (filters, checkedKeys) => {
    setIsBusy(true);
    const response = await getAllSummaryDataAggregations(filters);
    if (!response.success) {
      log.error(
        'SearchContext: applyFilters: Error fetching filtered sources',
        response.error,
      );
      setIsBusy(false);
      return;
    }

    setCards(response.sources);
    setFacets(response.aggregations);
    setSelectedFacets(
      selectedFacetsFromCheckedKeys(response.aggregations, checkedKeys),
    );
    setIsBusy(false);
  };

  const clearFilters = () => {
    setSelectedFacets(undefined);
    setFacets(config.aggregations);
    setCards(config.sources);
  };

  return (
    <SearchContext.Provider
      value={{
        config,
        cards,
        facets,
        selectedFacets,
        isBusy,
        applyFilters,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
