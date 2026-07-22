import { Table } from 'antd';

function ClinicalData({ data }) {
  const getColumns = () => {
    if (!data.data || data.data.length === 0) return [];

    const uniqueKeys = [...new Set(data.data.flatMap(Object.keys))];

    return uniqueKeys.map((key) => ({
      title: key,
      dataIndex: key,
      key,
      sorter: (a, b) =>
        typeof a[key] === 'string'
          ? a[key].localeCompare(b[key])
          : a[key] - b[key],
    }));
  };

  return (
    <div className="c-chart--table">
      <Table
        rowKey={(record) => record[data.key]}
        dataSource={data.data}
        columns={getColumns()}
        style={{ width: '100%', height: '100%' }}
        scroll={{ x: 'max-content' }}
        pagination={{ defaultPageSize: 20 }}
      />
    </div>
  );
}

export default ClinicalData;
