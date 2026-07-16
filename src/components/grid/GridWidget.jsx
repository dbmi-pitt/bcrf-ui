import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Dropdown, Tooltip } from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { ChartProvider } from '@/context/ChartContext';
import Chart from '../charts/Chart';

export default function GridWidget({
  title,
  widgetKey,
  chartData,
  onRemove,
}) {
  const items = [
    {
      key: '1',
      label: <a target="_blank">Show table</a>,
      icon: <TableOutlined />,
    },
    {
      key: '2',
      label: <a target="_blank">Download</a>,
      icon: <DownloadOutlined />,
      children: [
        {
          key: '2-1',
          label: <a target="_blank">Summary Data</a>,
        },
        {
          key: '2-2',
          label: <a target="_blank">Full Data</a>,
        },
        {
          key: '2-3',
          label: <a target="_blank">SVG</a>,
        },
        {
          key: '2-4',
          label: <a target="_blank">PDF</a>,
        },
      ],
    },
    {
      key: '3',
      label: <a target="_blank">Show Pie</a>,
      icon: <PieChartOutlined />,
    },
    {
      key: '4',
      label: <a target="_blank">Custom Bins</a>,
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <Card className="h-100" key={widgetKey} style={{ overflow: 'hidden' }}>
      <Card.Header className="d-flex justify-content-between align-items-center py-1 drag-header-handle"
      style={{cursor: 'move'}}
      >
        <Tooltip title={title}>
          <span className={'card-title text-truncate mb-0'}>{title}</span>
        </Tooltip>

        <div className="d-flex align-items-center gap-2">
          <Tooltip title={'Test tooltip'}>
            <InfoCircleOutlined />
          </Tooltip>

          <Dropdown menu={{ items }}>
            <a
              onClick={(e) => e.preventDefault()}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MenuOutlined />
            </a>
          </Dropdown>

          <Button
            variant="link"
            size="sm"
            className="p-0 text-dark text-decoration-none"
            onClick={onRemove}
          >
            ✕
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="d-flex flex-column" style={{ height: 0, flex: 1 }}>
        <ChartProvider>
          <Chart data={chartData.chart} />
        </ChartProvider>
      </Card.Body>
    </Card>
  );
}
