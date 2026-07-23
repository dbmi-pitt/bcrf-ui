import ChartContext from '@/context/ChartContext';
import { useContext } from 'react'
import { Checkbox, Table } from 'antd';

function Tabula({
  data,
  width,
  height,
}) {

  const {legendColors, isFilterable, activeFilters, chartFilter } =
    useContext(ChartContext);

  const checkboxFilter = (v, record) => {
    const value = record.x;
    chartFilter(data, value)
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
          
          if (key.eq('x')) {
            return <span><span style={{ display: 'inline-block', backgroundColor: legendColors.current[v], width: '12px', height: '12px'}}></span> {v}</span>
          }
          if (key.eq('y') && isFilterable) {
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
