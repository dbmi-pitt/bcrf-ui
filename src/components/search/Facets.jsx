import React, { useContext, useMemo, useState } from 'react';
import SearchContext from '@/context/SearchContext';
import { Tree, ConfigProvider } from 'antd';
import log from 'xac-loglevel';
import URLS from '@/lib/urls';

function Facets({}) {
  const { config, facets, setFacets, selectedFacets, setSelectedFacets } = useContext(SearchContext);
 
  
  /**
   * Filters checked keys by aggregations 
   * Avoids antd `Tree missing follow keys:`
   *
   * @param {*} aggregations 
   * @param {*} checkedKeys 
   */
  const filtedCheckedKeys = (aggregations, checkedKeys) => {
    const _checkedKKeys = [];
    for (const key in aggregations) {
      for (const values of aggregations[key]) {
        let _key = `${key.toDashedCase()}-${values.term.toDashedCase()}`;
        if (checkedKeys.indexOf(_key) !== -1) {
          _checkedKKeys.push(_key);
        }
      }
    }
    setSelectedFacets(_checkedKKeys);
  };

  /**
   * Calls the API to filter sources based on the provided filters and updates the state with the filtered sources and aggregated facets.
   *
   * @param {object} filters 
   * @param {array} checkedKeys
   */
  const filterSources = (filters, checkedKeys) => {
    fetch(URLS.api.local('sources/aggs'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filters }),
    }).then(async (response) => {
      if (!response.ok) {
        log.error(
          'Facets: onCheck: Error fetching filtered sources',
          response.statusText,
        );
        config.setIsBusy(false);
        return;
      }
      const result = await response.json();
      if (result.success) {
        config.setCards(result.sources);
        setFacets(result.aggregations);
        filtedCheckedKeys(result.aggregations, checkedKeys);
      }
      config.setIsBusy(false);
    });
  };

  
  /**
   * Handles a user's facet selection and filters sources
   *
   * @param {array} checkedKeys 
   * @param {object} info 
   */
  const onCheck = (checkedKeys, info) => {
    log.debug('Facets: onCheck', checkedKeys, info);
    //setSelectedFacets(checkedKeys);
    config.setIsBusy(true);

    const checkedFacets = info.checkedNodes.filter(
      (node) => node.children === undefined,
    );

    const filters = {};
    for (const facet of checkedFacets) {
      const parent = facet.parent;

      if (!filters[parent]) {
        filters[parent] = [];
      }
      if (filters[parent].indexOf(facet.field) === -1) {
        filters[parent].push(facet.field);
      }
    }

    filterSources(filters, checkedKeys);
  };


  const getTreeData = () => {
    if (!facets) return [];
    const treeData = Object.entries(facets).map(([facet, values], index) => {
        return {
          title: facet,
          field: facet,
          key: facet.toDashedCase(),
          children: values.map((value, valueIndex) => {
            let key = `${facet.toDashedCase()}-${value.term.toDashedCase()}`;
            return {
              title: `${value.term} (${value.count})`,
              field: value.term,
              key,
              parent: facet,
            };
          }),
        };
      });

    
    return treeData;
  };

  const treeData = useMemo(() => getTreeData(), [facets]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tree: {
            nodeSelectedBg: 'transparent',
            nodeHoverBg: 'transparent',
          },
        },
      }}
    >
      <Tree
        className="c-facets bg--transparent"
        checkable
        checkedKeys={selectedFacets}
        onCheck={onCheck}
        treeData={treeData}
      />
    </ConfigProvider>
  );
}

export default Facets;
