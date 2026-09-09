'use client';

import AppSpinner from '@/components/AppSpinner';
import SummaryCard from '@/components/sources/SummaryCard';
import { SearchProvider } from '@/context/SearchContext';
import { Masonry } from 'antd';
import { useState } from 'react';
import Facets from '@/components/search/Facets';
import ClearFilters from '@/components/search/ClearFilters';
import SourcesVizualizations from './SourcesVizualizations';

export default function SourcesExplorer({ summary }) {

  const [cards, setCards] = useState(summary.sources);
  const [isBusy, setIsBusy] = useState(false);


  const onCardTagClick = ({ data, tag, value }) => {
    window.location = `/sources/${data.source}?tag=${encodeURIComponent(tag.name)}&value=${encodeURIComponent(value)}`;
  };

  return (
    <>
     
      <div aria-label="Clinical Data Sources">
        <SearchProvider
          config={{ summary, cards, setCards, setIsBusy }}
        >
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
                    <>
                      {/* {index === 0 && <SourcesVizualizations />} */}
                      <SummaryCard
                        data={data}
                        index={index}
                        key={`card-${index}`}
                        onTagClick={onCardTagClick}
                      />
                    </>
                  )}
                />
              )}
            </div>
          </div>
          <br />
        </SearchProvider>
      </div>
      {isBusy && <AppSpinner />}
    </>
  );
}
