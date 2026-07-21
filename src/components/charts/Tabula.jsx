import { Checkbox, Table } from 'antd';

function Tabula({
  data,
  width,
  height,
  isFilterable,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
}) {
  const checkboxFilter = (v, record) => {
    if (!isFilterable) {
      return;
    }
    const value = record.x;
    if (activeFilters.includes(value)) {
      onRemoveFilter(data.id, value);
    } else {
      onAddFilter(data.id, value);
    }
  };

  const getColumns = () => {
    const uniqueKeys = [...new Set(data.data.flatMap(Object.keys))];
    const columns = [];
    for (const key of uniqueKeys) {
      columns.push({
        title: data.labels[key] || (key == 'x' ? '' : key),
        dataIndex: key,
        sorter: (a, b) =>
          typeof a[key] === 'string'
            ? a[key].localeCompare(b[key])
            : a[key] - b[key],
        key,
        render: (v, record) => {
          if (key === 'y') {
            return (
              <Checkbox
                checked={activeFilters.includes(record.x)}
                disabled={!isFilterable}
                onChange={() => checkboxFilter(v, record)}
              >
                {v}
              </Checkbox>
            );
          }
          return v;
        },
      });
    }
    return columns;
  };
  return (
    <div className='c-chart--table'>
      <Table
        size="small"
        rowKey={'x'}
        dataSource={data.data}
        columns={getColumns()}
        style={{ width: width, height: height }}
      />
    </div>
  );
}

export default Tabula;
