import SearchContext from '@/context/SearchContext';
import { useContext } from 'react';
import log from 'xac-loglevel';

function ClearFilters() {
  const { config, setActiveSources, setSelectedFacets, setFacets } =
    useContext(SearchContext);

  const handleClearFilters = () => {
    log.debug('ClearFilters: handleClearFilters', config);
    setSelectedFacets(undefined);
    setFacets(config.aggregations);
    setActiveSources(config.activeSources);
  };
  return (
    <div>
      <button
        className="c-btn c-btn--primary rounded-0 d-block w-100 mb-2"
        onClick={handleClearFilters}
      >
        <span>Clear Filters</span>
      </button>
    </div>
  );
}

export default ClearFilters;
