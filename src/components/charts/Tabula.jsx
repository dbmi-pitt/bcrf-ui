import React from 'react'
import { Table } from 'antd';

function Tabula({ data, layout }) {
  const getColumns = () => {
    const uniqueKeys = [...new Set(data.data.flatMap(Object.keys))];
    const columns = []
    for (const key of uniqueKeys) {
      columns.push({
        title: data.labels[key] || key,
        dataIndex: key,
        key,
      })
    }
    return columns
  }
  return (
    <div>
      <Table dataSource={data.data} columns={getColumns()} />;
    </div>
  )
}

export default Tabula