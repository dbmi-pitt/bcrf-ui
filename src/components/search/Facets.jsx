import SearchContext from '@/context/SearchContext';
import { ConfigProvider, Tree } from 'antd';
import { useContext } from 'react';
import log from 'xac-loglevel';

function Facets({}) {
  const { facets, selectedFacets, applyFilters } = useContext(SearchContext);

  /**
   * Handles a user's facet selection and filters sources
   *
   * @param {array} checkedKeys
   * @param {object} info
   */
  const onCheck = (checkedKeys, info) => {
    log.debug('Facets: onCheck', checkedKeys, info);

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

    applyFilters(filters, checkedKeys);
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

  const treeData = getTreeData();

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
