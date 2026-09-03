import React, { useContext, useMemo, useState } from 'react';
import SearchContext from '@/context/SearchContext';
import { Tree, ConfigProvider } from 'antd';
import log from 'xac-loglevel';
import { DEMO } from '@/lib/demo';
import URLS from '@/lib/urls';

function Facets({}) {
  const { config, facets, setFacets } = useContext(SearchContext);
  const [aggregatedFacets, setAggregatedFacets] = useState([]);
  
  /**
   * Calls the API to filter sources based on the provided filters and updates the state with the filtered sources and aggregated facets.
   *
   * @param {object} filters 
   */
  const filterSources = (filters) => {
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

        const aggs = {};
        for (const agg in result.aggregations) {
          if (!aggs[agg]) {
            aggs[agg] = {};
          }
          for (const value of result.aggregations[agg]) {
            aggs[agg][value.term] = value.count;
          }
        }
        setAggregatedFacets(aggs);
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
    setFacets(checkedKeys);
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

    filterSources(filters);
  };

  const onCheckDemo = (checkedKeys, info) => {
    // This is a demo implementation of filtering logic based on checked facets
    log.debug('Facets: onCheckDemo', checkedKeys, info, treeData);
    setFacets(checkedKeys);
    config.setIsBusy(true);

    const filteredSources = [];

    const checkedFacets = info.checkedNodes
      .filter((node) => node.children === undefined)
      .map((node) => node.field);

    for (const facet of checkedFacets) {
      filteredSources.push(DEMO.filterSources(config, facet));
    }

    if (filteredSources.length === 0) {
      config.setCards(info.checkedNodes.length ? [] : config.dataSources);
      config.setIsBusy(false);
      return;
    }

    const andFilter = DEMO.getFilterGroup(filteredSources);
    let filteredSourcesArray = filteredSources[andFilter.index] || [];
    filteredSourcesArray = Array.from(new Set(filteredSourcesArray));
    config.setCards(
      info.checkedNodes.length ? filteredSourcesArray : config.dataSources,
    );
    config.setIsBusy(false);
  };

  
  /**
   * Returns the default expanded facets for the tree nodes
   *
   * @type {*}
   */
  const defaultExpandedKeys = useMemo(() => {
    if (!config) return [];
    const facets = config.facets || [];
    return facets
      .filter(
        (facet) => facet.values && facet.values.length > 0 && facet.isExpanded,
      )
      .map((facet, index) => {
        return `0-${index}`;
      });
  }, [config]);

  /**
   * Returns the default checked keys for the tree nodes
   *
   * @returns {array} The default checked keys
   */
  const defaultCheckedKeys = useMemo(() => {
    if (!config) return [];
    let facets = config.facets || [];
    facets = facets.filter(
      (facet) => facet.values && facet.values.length > 0 && facet.isChecked,
    );
    const checkedKeys = [];
    facets.forEach((facet, index) => {
      facet.values.forEach((value, valueIndex) => {
        checkedKeys.push(`0-${index}-${valueIndex}`);
      });
    });
    return checkedKeys;
  }, [config]);

  const getTreeData = () => {
    if (!config) return [];
    const facets = config.facets || [];
    return facets.map((facet, index) => {
      return {
        title: facet.name,
        field: facet.name,
        key: `0-${index}`,
        children: facet.values.map((value, valueIndex) => {
          return {
            title:
              aggregatedFacets[facet.name]?.[value] !== undefined
                ? `${value} (${aggregatedFacets[facet.name][value]})`
                : value,
            field: value,
            key: `0-${index}-${valueIndex}`,
            parent: facet.name,
          };
        }),
      };
    });
  };

  const treeData = useMemo(() => getTreeData(), [config]);

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
        defaultExpandedKeys={defaultExpandedKeys}
        defaultCheckedKeys={defaultCheckedKeys}
        checkedKeys={facets}
        onCheck={onCheck}
        treeData={treeData}
      />
    </ConfigProvider>
  );
}

export default Facets;
