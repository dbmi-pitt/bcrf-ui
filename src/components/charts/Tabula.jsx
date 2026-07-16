import React from 'react'
import { Table, Checkbox } from 'antd';
import log from 'xac-loglevel'

function Tabula({ data, layout }) {

  const checkboxFilter = (v, record) => {
    log.debug('Tabula.checkboxFilter', v, record)
  }

  const getColumns = () => {
    const uniqueKeys = [...new Set(data.data.flatMap(Object.keys))];
    const columns = []
    for (const key of uniqueKeys) {
      columns.push({
        title: data.labels[key] || key,
        dataIndex: key,
        sorter: (a, b) => typeof a[key] === 'string' ? (a[key].localeCompare(b[key])) : (a[key] - b[key]),
        key,
        render: (v, record) => {
          if (key === 'y') {
            return <>
            <Checkbox onChange={() => checkboxFilter(v, record)} /> {v}
            </>
          }
          return v
        }
      })
    }
    return columns
  }
  return (
    <div>
      <Table size="small" rowKey={'x'}  dataSource={data.data} columns={getColumns()} style={{width: layout.w - layout.m}} />
    </div>
  )
}

export default Tabula