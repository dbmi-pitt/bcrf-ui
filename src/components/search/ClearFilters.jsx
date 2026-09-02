import React, {useContext} from 'react'
import SearchContext from '@/context/SearchContext'
import log from 'xac-loglevel';

function ClearFilters() {
  const { config, setFacets } = useContext(SearchContext)
  const handleClearFilters = () => {
    
    log.debug('ClearFilters: handleClearFilters', config)
    setFacets(undefined)
    config.setCards(config.dataSources)
    
  }
  return (
    <div><button className="c-btn c-btn--primary rounded-0 d-block w-100 mb-2" onClick={handleClearFilters}>
      <span>Clear Filters</span>
    </button></div>
  )
}

export default ClearFilters