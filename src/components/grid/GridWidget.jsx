import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Dropdown, Tooltip } from 'antd';
import {
  BarChartOutlined,
  CalculatorOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { ChartProvider } from '@/context/ChartContext';
import Chart from '@/components/charts/Chart';

export default function GridWidget({
  title,
  widgetKey,
  chartData,
  onRemove,
  layout,
}) {
  const [chartType, setChartType] = useState(chartData.chart.types[0]);

  const resolveChartType = () => {
    let defaultType = chartData.chart.types[0];
    return (
      chartData.chart.types.filter((t) => t !== chartType)[0] || defaultType
    );
  };

  const icons = {
    table: <TableOutlined />,
    pie: <PieChartOutlined />,
    histogram: <BarChartOutlined />,
  };

  const getItems = () => {
    const items = [];
    if (chartData.chart.types.length > 1) {
      const switchTo = resolveChartType();
      items.push({
        key: 'switchChart',
        label: (
          <span onClick={() => setChartType(switchTo)}>Show {switchTo}</span>
        ),
        icon: icons[switchTo],
      });
    }
    if (chartType === 'histogram') {
      items.push({
        key: 'compareGroups',
        label: <span>Compare Groups</span>,
        icon: <CalculatorOutlined />,
      });
      items.push({
        key: 'customBins',
        label: <span>Custom Bins</span>,
        icon: icons.histogram,
      });
    }
    items.push({
      key: 'download',
      label: <span>Download</span>,
      icon: <DownloadOutlined />,
      children: [
        {
          key: 'downloadSummary',
          label: 'Summary Data',
        },
        {
          key: 'downloadData',
          label: 'Full Data',
        },
        {
          key: 'downloadSVG',
          label: 'SVG',
        },
        {
          key: 'downloadPDF',
          label: 'PDG',
        },
      ],
    });

    return items;
  };

  return (
    <Card className="h-100" key={widgetKey} style={{ overflow: 'hidden' }}>
      <Card.Header
        className="d-flex justify-content-between align-items-center py-1 drag-header-handle"
        style={{ cursor: 'move' }}
      >
        <Tooltip title={title}>
          <span className={'card-title text-truncate mb-0'}>{title}</span>
        </Tooltip>

        <div className="d-flex align-items-center gap-2">
          <Tooltip title={'Test tooltip'}>
            <InfoCircleOutlined />
          </Tooltip>

          <Dropdown menu={{ items: getItems() }}>
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
          <Chart data={chartData.chart} chartType={chartType} layout={layout} />
        </ChartProvider>
      </Card.Body>
    </Card>
  );
}
