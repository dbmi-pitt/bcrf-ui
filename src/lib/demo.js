export const DEMO = {
  getFilterGroup: (groupIds) => {
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

  },
  filterSources: (config, facetName) => {
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

    let andFilter = DEMO.getFilterGroup(groupIds);

    const filteredSources = config.dataSources.filter((source) =>
      groupIds[andFilter.index].includes(source.source),
    );
    return filteredSources;
  }

}