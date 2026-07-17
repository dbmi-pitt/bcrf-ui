const exampleMappedFilters = {
  'Cancer Type Detailed': ['Breast Invasive Ductal Carcinoma'],
  'Pathologic Stage': ['Stage IIA'],
};

export function buildFilterClause(filters = {}) {
  const clauses = [];
  const params = {};

  let paramIdx = 0;
  for (const [column, values] of Object.entries(filters)) {
    if (!values || !values.length) {
      continue;
    }

    const valueList = [];
    for (const value of values) {
      const paramName = `param${paramIdx}`;
      const clause = `"${column}" = $${paramName}`;
      valueList.push(clause);
      params[paramName] = value;
      paramIdx++;
    }

    const joinedValues = valueList.join(' OR ');
    clauses.push(`(${joinedValues})`);
  }

  const finalClause = clauses.length ? `${clauses.join(' AND ')}` : '';

  return {
    clause: finalClause,
    params: params,
  };
}
