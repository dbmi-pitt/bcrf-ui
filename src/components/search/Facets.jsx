import React, { useContext, useEffect, useMemo, useState } from 'react';
import SearchContext from '@/context/SearchContext';
import { Tree, ConfigProvider } from 'antd';
import log from 'xac-loglevel';

function Facets({}) {
  const { config, facets, setFacets } = useContext(SearchContext);

  const getFilterGroup = (groupIds) => {
    let andFilter = {length: groupIds[0].length, index: 0};
    for (let i = 1; i < groupIds.length; i++) {
      if (groupIds[i].length > 0) {
        andFilter = {
          length: Math.min(andFilter.length, groupIds[i].length) || andFilter.length,
          index: groupIds[i].length < andFilter.length || andFilter.length === 0 ? i : andFilter.index,
        };
        andFilter.length = groupIds[andFilter.index].length;
      }
    }
    return andFilter;

  }
  const filterSources = (facetName) => {
    const groups = config.facets?.map((facet) => facet.sources) || {};
    const groupIds = [];
    let sourceIds;

    for (const sources of groups) {
      sourceIds = new Set();
      for (const source in sources) {
        const facets = sources[source].value_map || {};
        for (const facet in facets) {
          if (facets[facet] === facetName) {
            sourceIds.add(source);
          }
        }
      }
      groupIds.push(Array.from(sourceIds));
    }

    if (groupIds.length === 0) {
      return [];
    }

    let andFilter = getFilterGroup(groupIds);

    const filteredSources = config.dataSources.filter((source) =>
      groupIds[andFilter.index].includes(source.source),
    );
    return filteredSources;
  };

  const onCheck = (checkedKeys, info) => {
    setFacets(checkedKeys);
    config.setIsBusy(true);

    const filteredSources = [];
    const checkedFacets = info.checkedNodes
      .filter((node) => node.children === undefined)
      .map((node) => node.title);

    for (const facet of checkedFacets) {
      filteredSources.push(filterSources(facet));
    }

    if (filteredSources.length === 0) {
      config.setCards(
        info.checkedNodes.length ? [] : config.dataSources,
      );
      config.setIsBusy(false);
      return;
    }

    const andFilter = getFilterGroup(filteredSources);
    let filteredSourcesArray = filteredSources[andFilter.index] || [];
    filteredSourcesArray = Array.from(new Set(filteredSourcesArray));
    config.setCards(
      info.checkedNodes.length ? filteredSourcesArray : config.dataSources,
    );
    config.setIsBusy(false);
    log.debug('Facets: onCheck', checkedKeys, info);
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

  const treeData = useMemo(() => {
    if (!config) return [];
    const facets = config.facets || [];
    return facets.map((facet, index) => {
      return {
        title: facet.name,
        key: `0-${index}`,
        children: facet.values.map((value, valueIndex) => {
          return {
            title: value,
            key: `0-${index}-${valueIndex}`,
          };
        }),
      };
    });
  }, [config]);



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
