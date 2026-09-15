import SearchContext from '@/context/SearchContext';
import { useContext } from 'react';

function ClearFilters() {
  const { clearFilters } = useContext(SearchContext);

  return (
    <div>
      <button
        className="c-btn c-btn--primary rounded-0 d-block w-100 mb-2"
        onClick={clearFilters}
      >
        <span>Clear Filters</span>
      </button>
    </div>
  );
}

export default ClearFilters;
