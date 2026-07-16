import React, {useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Popover, Tooltip } from 'antd';
import { InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { ChartProvider } from '@/context/ChartContext';
import Chart from '../charts/Chart';

export default function GridWidget({ title, widgetKey, chartData, onRemove, layout }) {
  useEffect(() => {
    console.log(chartData, layout)
  }, [])
  return (
    <Card className="h-100" key={widgetKey} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Card.Header className="d-flex justify-content-between align-items-center py-1">
        <span>{title}</span>

        <div className="d-flex align-items-center gap-2">
          <Tooltip title={'Test tooltip'}>
            <InfoCircleOutlined />
          </Tooltip>

          {/*TODO: Define content component */}
          <Popover content={'Test'} title="Title" trigger="click">
            <MenuOutlined />
          </Popover>

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

      <Card.Body>
        <ChartProvider>
          <Chart data={chartData.chart} layout={layout} />
        </ChartProvider>
      </Card.Body>
    </Card>
  );
}
