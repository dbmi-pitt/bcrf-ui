'use client';

import AppSpinner from '@/components/AppSpinner';
import SummaryCard from '@/components/sources/SummaryCard';
import { SearchProvider } from '@/context/SearchContext';
import { Masonry, Tag } from 'antd';
import { useState } from 'react';
import { summaryDataSources } from '@/lib/content/summaryDataSources';
import Facets from '@/components/search/Facets';
import ClearFilters from '../search/ClearFilters';

export default function SourcesExplorer({ dataSources }) {
  const [tags, setTags] = useState([]);
  const [cards, setCards] = useState(dataSources);
  const [isBusy, setIsBusy] = useState(false);

  const filterCards = (tag, value, sources = []) => {
    const sourceIds = sources.map((d) => d.source);
    const dict = {};
    sourceIds.forEach((role) => {
      dict[role] = true;
    });

    // filter out the cards already included
    const availableSources =
      dataSources.filter((d) => dict[d.source] === undefined) || [];
    availableSources.map((data) => {
      ( data.tags || []).map((t) => {
        if (
          dict[data.source] === undefined &&
          t.name === tag.name &&
          t.values.indexOf(value) !== -1
        ) {
          sources.push(data);
          dict[data.source] = true;
        }
      });
    });
    return sources;
  };

  const onCardTagClick = ({ data, tag, value }) => {
    const found = tags.map(
      (t) => t.value == value && t.name === tag.name && t.id === data.source,
    );
    if (found.length <= 0) {
      const sources = filterCards(tag, value);
      setCards(sources);
      setTags([...tags, { name: tag.name, value, id: data.source }]);
    }
  };

  const getHeaderTags = () => {
    const list = [];
    for (const t of tags) {
      list.push(
        <Tag
          className="c-tag c-tag--filter"
          key={`${t.name}-${t.value}`}
          closable
          onClose={() => onHeaderTagClick(t)}
          style={{
            paddingInline: 10,
            paddingBlock: 4,
          }}
        >
          <strong>{t.name}</strong>: {t.value}
        </Tag>,
      );
    }
    return list;
  };

  const onHeaderTagClick = (tag) => {
    const newTags = tags.filter(
      (t) => t.id === tag.id && t.value !== tag.value,
    );
    let sources = [];
    for (const t of newTags) {
      sources = filterCards(t, t.value, sources);
    }
    setCards(sources.length ? sources : dataSources);
    setTags(newTags);
  };

  const headerTags = getHeaderTags();

  return (
    <>
      <div
        className="c-selectedTags"
        aria-label="Selected Tags"
        style={{ minHeight: 70 }}
      >
        {headerTags.length > 0 && (
          <div className="c-selectedTags__wrap">{headerTags}</div>
        )}
      </div>
      <div aria-label="Clinical Data Sources">
        <SearchProvider config={{ facets: summaryDataSources[0].common_fields, dataSources, setCards, setTags, setIsBusy }}>
          <div className="row">
            <div className="col-2">
              <ClearFilters />
              <Facets />
              </div>
            <div className="col-10">
              {cards && (
                <Masonry
                  columns={{ xs: 1, sm: 2, md: 3 }}
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
        </SearchProvider>
      </div>
      {isBusy && <AppSpinner />}
    </>
  );
}
