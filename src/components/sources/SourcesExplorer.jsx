'use client';

import { useContext, useMemo } from 'react';
import AppSpinner from '@/components/AppSpinner';
import ClearFilters from '@/components/search/ClearFilters';
import Facets from '@/components/search/Facets';
import SummaryCard from '@/components/sources/SummaryCard';
import SearchContext, { SearchProvider, selectedFacetsFromCheckedKeys } from '@/context/SearchContext';
import { filtersToQueryString } from '@/lib/urlFilters';
import { CloseOutlined } from '@ant-design/icons';
import { Masonry, Tag } from 'antd';
import SourcesVizualizations from './SourcesVizualizations';
import log from 'xac-loglevel';
import THEME from '@/lib/theme';

const onCardTagClick = ({ data, tag, value }) => {
  const query = filtersToQueryString({ [tag]: [value] });
  window.location = `/sources/${data.source}${query}`;
};

function SourcesExplorerBody() {
  const { cards, facets, selectedFacets, isBusy, applyFilters, clearFilters } = useContext(SearchContext);

  const tags = useMemo(() => {
    if (!selectedFacets) return [];
    const tags = selectedFacetsFromCheckedKeys(facets, selectedFacets, false);
    return tags;
  }, [facets, selectedFacets]);

  const handleRemoveFilter = (tag) => {
    log.debug('SourcesExplorerBody: handleRemoveFilter', tag);
    const newTags = tags.filter((t) => t.key !== tag.key);
    if (newTags.length) {
      const filters = newTags.reduce((accumulator, item) => {
        const key = item.facet;
        accumulator[key] ??= [];
        accumulator[key].push(item.term);
        return accumulator;
      }, {});

      applyFilters(
        filters,
        newTags.map((t) => t.key),
      );
    } else {
      clearFilters();
    }
  };

  return (
    <>
      <div aria-label="Clinical Data Sources">
        <div className="c-sourcesExplorer__vizualizations">
          <SourcesVizualizations />
        </div>
        {/*TODO: Add Manifest export that works with Globus CLI*/}
        <div className="row">
          <div className="col-lg-10 align-content-center">
            {tags.map((tag) => (
              <Tag
                className="c-tag--filter mx-1 mb-1"
                key={tag.key}
                variant="solid"
                color={THEME.colors.navy}
                closable
                closeIcon={
                  <CloseOutlined style={{ color: '#fff', fontSize: 12 }} />
                }
                onClose={() => handleRemoveFilter(tag)}
                style={{
                  paddingInline: 10,
                  paddingBlock: 4,
                }}
              >
                <b>{tag.facet}</b>: {tag.term}
              </Tag>
            ))}
          </div>
          <div className="col-lg-2">
            <button className="c-btn c-btn--secondary rounded-0 mb-2 d-block float-end">
              <span>Manifest </span>
              <i className="text-white bi bi-download"></i>
            </button>
          </div>
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
