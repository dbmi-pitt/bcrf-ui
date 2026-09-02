import React, { useContext, useEffect, useMemo, useState } from 'react';
import SearchContext from '@/context/SearchContext';
import { Tree, ConfigProvider } from 'antd';
import log from 'xac-loglevel';
import { DEMO } from '@/lib/demo';

function Facets({}) {
  const { config, facets, setFacets } = useContext(SearchContext);
  const [aggregatedFacets, setAggregatedFacets] = useState([]);

  const onCheck = (checkedKeys, info) => {
    log.debug('Facets: onCheck', checkedKeys, info);
    setFacets(checkedKeys);
    config.setIsBusy(true);

    
    const checkedFacets = info.checkedNodes
      .filter((node) => node.children === undefined)
    
    const filters = {}
    for (const facet of checkedFacets) {
      const parent = facet.parent;

      if (!filters[parent]) {
        filters[parent] = new Set();
      }
      filters[parent].add(facet.field);
    }

    // TODO: get the filtered sources based on the filters object
    const result = getFilteredSources(filters);
    if (result.success) {
      config.setCards(result.sources);

      const aggs = {}
      for (const agg in result.aggregations) {
        if (!aggs[agg]) {
          aggs[agg] = {}
        }
        for (const value of result.aggregations[agg]) {
          aggs[agg][value.term] = value.count
        }
      }
      setAggregatedFacets(aggs);
    }
    
    config.setIsBusy(false);
  }

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
      config.setCards(
        info.checkedNodes.length ? [] : config.dataSources,
      );
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
            title: aggregatedFacets[facet.name]?.[value] !== undefined
              ? `${value} (${aggregatedFacets[facet.name][value]})`
              : value,
            field: value,
            key: `0-${index}-${valueIndex}`,
            parent: facet.name,
          };
        }),
      };
    });
  }

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
        onCheck={onCheckDemo}
        treeData={treeData}
      />
      
    </ConfigProvider>
  );
}

export default Facets;
