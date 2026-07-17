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
import HistogramBinsModal from '../charts/partials/HistogramBinsModal';

export default function GridWidget({
  title,
  widgetKey,
  chartData,
  onRemove,
}) {
  const [chartType, setChartType] = useState(chartData.chart.types[0]);
  const [modal, setModal] = useState({});
  const [data, setData] = useState(chartData.chart);

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

  const isHistogram = () => chartType.eq('histogram');

  const getItems = () => {
    const items = [];
    if (chartData.chart.types.length > 1) {
      const switchTo = resolveChartType();
      items.push({
        key: `switchChart:${switchTo}`,
        label: `Show ${switchTo}`,
        icon: icons[switchTo],
      });
    }
    if (isHistogram()) {
      // TODO: uncomment if and add corrresponding logic if needed later
      // items.push({
      //   key: 'compareGroups',
      //   label: <span>Compare Groups</span>,
      //   icon: <CalculatorOutlined />,
      //   children: [
      //     {
      //       key: 'compareGroups:Quartiles',
      //       label: 'Quartiles',
      //     },
      //     {
      //       key: 'compareGroups:Median',
      //       label: 'Median',
      //     },
      //     {
      //       key: 'compareGroups:bins',
      //       label: 'Current bins',
      //     },
      //   ],
      // });

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
          key: 'download:Summary',
          label: 'Summary Data',
        },
        {
          key: 'download:Data',
          label: 'Full Data',
        },
        {
          key: 'download:SVG',
          label: 'SVG',
        },
        {
          key: 'download:PDF',
          label: 'PDF',
        },
      ],
    });

    return items;
  };

  const onChartOptions = (options) => {
    setData({ ...data, options });
  };

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('switchChart:')) {
      const newType = key.split(':')[1];
      setChartType(newType);
    }
    if (key.eq('customBins')) {
      setModal({ ...modal, open: true });
    }
  };

  const menuProps = {
    items: getItems(),
    onClick: handleMenuClick,
  };

  return (
    <Card className="c-gridWidget h-100" key={widgetKey} style={{ overflow: 'hidden' }}>
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

          <Dropdown menu={menuProps}>
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
          {/* // TODO: build over over legend table for pie chart */}
          <Chart data={data} chartType={chartType} />
        </ChartProvider>
      </Card.Body>
      {isHistogram() && (
        <HistogramBinsModal key={widgetKey} onChange={onChartOptions} modal={modal} setModal={setModal} options={data.options || {}} />
      )}
    </Card>
  );
}
