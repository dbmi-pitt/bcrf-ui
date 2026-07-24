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
    switch (type) {
      case 'term':
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
        break;

      case 'range':
        const min = values.min;
        const max = values.max;

        if (min !== undefined && max !== undefined) {
          const minParamName = `param${paramIdx}`;
          params[minParamName] = min;
          paramIdx++;

          const maxParamName = `param${paramIdx}`;
          params[maxParamName] = max;
          paramIdx++;

          clauses.push(
            `("${column}" > $${minParamName} AND "${column}" <= $${maxParamName})`,
          );
        } else if (min !== undefined && max === undefined) {
          const minParamName = `param${paramIdx}`;
          params[minParamName] = min;
          paramIdx++;

          clauses.push(`("${column}" > $${minParamName})`);
        } else if (min === undefined && max !== undefined) {
          const maxParamName = `param${paramIdx}`;
          params[maxParamName] = max;
          paramIdx++;

          clauses.push(`("${column}" <= $${maxParamName})`);
        } else {
          continue; // skip if both min and max are undefined
        }
    }
  }

  const finalClause = clauses.length ? `${clauses.join(' AND ')}` : '';

  return {
    clause: finalClause,
    params: params,
  };
}
