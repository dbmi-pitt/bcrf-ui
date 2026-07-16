import React, {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Popover, Tooltip, Dropdown } from 'antd';
import { InfoCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { ChartProvider } from '@/context/ChartContext';
import Chart from '@/components/charts/Chart';

export default function GridWidget({ title, widgetKey, chartData, onRemove, layout }) {

  const [chartType, setChartType] = useState(chartData.chart.types[0])

  const resolveChartType = () => {
    let defaultType = chartData.chart.types[0]
    return chartData.chart.types.filter((t) => t !== chartType)[0] || defaultType
  }



  const getItems = () => {
    const items = []
    if (chartData.chart.types.length > 1) {
      const switchTo = resolveChartType()
      items.push(
        {
          key: 'switchChart',
          label: <span onClick={() => setChartType(switchTo)}>Show {switchTo}</span>
        }
      )
    }
    items.push({
      key: 'download',
      label: <span>Download</span>,
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
      ]
    })

    return items;
  }

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
          {/* <Popover content={'Test'} title="Title" trigger="click">
            <MenuOutlined />
          </Popover> */}
          <Dropdown menu={{ items: getItems() }} placement="bottomLeft" arrow>
            <MenuOutlined />
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

      <Card.Body>
        <ChartProvider>
          <Chart data={chartData.chart} chartType={chartType} layout={layout} />
        </ChartProvider>
      </Card.Body>
    </Card>
  );
}
