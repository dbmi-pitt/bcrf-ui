import React, {useContext, useEffect, useMemo} from 'react'
import SearchContext from '@/context/SearchContext'
import { Tree, ConfigProvider } from 'antd';

function Facets({setCards, setTags}) {
  const { config } = useContext(SearchContext)

  const filterSources = (facetName) => {
    const groups = config.facets?.map((facet) => facet.sources) || {}
    const sourceIds = new Set()
    for (const sources of groups) {
      for (const source in sources) {
        const facets = sources[source].value_map || {};
        for (const facet in facets) {
          if (facets[facet] === facetName) {
            sourceIds.add(source);
          }
        }
      }
    }
   
    const filteredSources = config.dataSources.filter((source) => sourceIds.has(source.source))
    return filteredSources
  }

  const onCheck = (checkedKeys, info) => {
    let filteredSources = new Set()
    for (const node of info.checkedNodes) {
      filteredSources = new Set([...filteredSources, ...filterSources(info.node.title)])
    }
    const filteredSourcesArray = Array.from(filteredSources)
    setCards(info.checkedNodes.length ? filteredSourcesArray : config.dataSources)
    //setTags(info.checkedNodes.map((node) => ({name: node.title, value: true, id: node.key})))

    console.log('onCheck', checkedKeys, info);
  };

  const defaultExpandedKeys = useMemo(() => {
    if (!config) return []
    const facets = config.facets || []
    return facets.filter((facet) => facet.values && facet.values.length > 0 && facet.isExpanded).map((facet, index) => {
      return `0-${index}`
    })
  }, [config])

  const defaultCheckedKeys = useMemo(() => {
    if (!config) return []
    let facets = config.facets || []
    facets = facets.filter((facet) => facet.values && facet.values.length > 0 && facet.isChecked)  
    const checkedKeys = []
    facets.forEach((facet, index) => {
      facet.values.forEach((value, valueIndex) => {
        checkedKeys.push(`0-${index}-${valueIndex}`)
      })
    })
    return checkedKeys
  }, [config])    

  const treeData = useMemo(() => {
    if (!config) return []
    const facets = config.facets || []
    return facets.map((facet, index) => {
      return {
        title: facet.name,
        key: `0-${index}`,
        children: facet.values.map((value, valueIndex) => {
          return {
            title: value,
            key: `0-${index}-${valueIndex}`,
          }
        }),
      }
    })
  }, [config])

  
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
      checkable
      defaultExpandedKeys={defaultExpandedKeys}
      defaultCheckedKeys={defaultCheckedKeys}
      onCheck={onCheck}
      treeData={treeData}
    />
  </ConfigProvider>
     
  )
}

export default Facets