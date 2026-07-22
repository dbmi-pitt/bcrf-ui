// const exampleMappedFilters = {
//   'Cancer Type Detailed': ['Breast Invasive Ductal Carcinoma'],
//   'Pathologic Stage': ['Stage IIA'],
//   'Age at Diagnosis': [50, 60],
// };

export function buildFilterClause(filters) {
  const clauses = [];
  const params = {};

  let paramIdx = 0;
  for (const [column, { type, values }] of Object.entries(filters)) {
    if (!values || !values.length) {
      continue;
    }

    switch (type) {
      case 'term':
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
        break;

      case 'range':
        const [min, max] = values;
        const minParamName = `param${paramIdx}`;
        params[minParamName] = min;
        paramIdx++;

        const maxParamName = `param${paramIdx}`;
        params[maxParamName] = max;
        paramIdx++;

        clauses.push(
          `("${column}" > $${minParamName} AND "${column}" <= $${maxParamName})`,
        );
        break;
    }
  }

  const finalClause = clauses.length ? `${clauses.join(' AND ')}` : '';

  return {
    clause: finalClause,
    params: params,
  };
}
