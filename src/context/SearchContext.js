import { getAllSummaryDataAggregations } from '@/lib/sources/actions';
import { createContext, useState, useEffect } from 'react';
import log from 'xac-loglevel';

const SearchContext = createContext({});

export const selectedFacetsFromCheckedKeys = (aggregations, checkedKeys, returnKeys = true) => {
  const selected = [];
  for (const facet in aggregations) {
    for (const { term } of aggregations[facet]) {
      const key = `${facet.toDashedCase()}-${term.toDashedCase()}`;
      if (checkedKeys.indexOf(key) !== -1) {
        selected.push( returnKeys ? key : {facet, term, key});
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

  const updateUrl = (filters) => {
    const url = new URL(window.location.href);
    for (const key in filters) {
      const currentFilters = url.searchParams.get(key);
      const currentFiltersArray = currentFilters ? currentFilters.split(',') : [];
      const newFiltersArray = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
      const mergedFiltersArray = Array.from(new Set([...currentFiltersArray, ...newFiltersArray]));
      url.searchParams.delete(key);
      url.searchParams.append(key, mergedFiltersArray.join(','));
    }
    window.history.replaceState(null, '', url.toString());
  };

  const applyFilters = async (filters, checkedKeys, shouldUpdateUrl = true) => {
    log.debug('SearchProvider: applyFilters', filters, checkedKeys)
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
    if (shouldUpdateUrl) {
      updateUrl(filters);
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
    window.history.replaceState(null, '', window.location.href.replace(window.location.search, ''));
  };

  const applyInitialFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {};
    for (const key of urlParams.keys()) {
      filters[key] = urlParams.get(key).split(',');
    }
    const keys = [];
    for (const facet in filters) {
      for (const term of filters[facet]) {
        const key = `${facet.toDashedCase()}-${term.toDashedCase()}`;
        keys.push(key);
      }
    }

    if (Object.keys(filters).length > 0) {  
      applyFilters(filters, keys, false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applyInitialFilters();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
