'use client';

import AppSpinner from '@/components/AppSpinner';
import ClearFilters from '@/components/search/ClearFilters';
import Facets from '@/components/search/Facets';
import SummaryCard from '@/components/sources/SummaryCard';
import SearchContext, { SearchProvider } from '@/context/SearchContext';
import { filtersToQueryString } from '@/lib/urlFilters';
import { Masonry } from 'antd';
import { useContext } from 'react';
import SourcesVizualizations from './SourcesVizualizations';

const onCardTagClick = ({ data, tag, value }) => {
  const query = filtersToQueryString({ [tag]: [value] });
  window.location = `/sources/${data.source}${query}`;
};

function SourcesExplorerBody() {
  const { cards, isBusy } = useContext(SearchContext);

  return (
    <>
      <div aria-label="Clinical Data Sources">
        <div className="c-sourcesExplorer__vizualizations">
          <SourcesVizualizations />
        </div>
        <div className="row">
          <div className="col-lg-2">
            <ClearFilters />
            <Facets />
          </div>
          <div className="col-lg-10">
            {cards && (
              <Masonry
                columns={{ xs: 1, sm: 2, xl: 3 }}
                gutter={10}
                items={cards.map((source, index) => ({
                  key: `item-${index}`,
                  data: source,
                }))}
                itemRender={({ data, index }) => (
                  <SummaryCard
                    data={data}
                    index={index}
                    key={`card-${index}`}
                    onTagClick={onCardTagClick}
                  />
                )}
              />
            )}
          </div>
        </div>
        <br />
      </div>
      {isBusy && <AppSpinner />}
    </>
  );
}

export default function SourcesExplorer({ sources, aggregations }) {
  return (
    <SearchProvider config={{ sources, aggregations }}>
      <SourcesExplorerBody />
    </SearchProvider>
  );
}
