import Chart from '@/components/charts/Chart';
import { ChartProvider } from '@/context/ChartContext';
import { autoBlobDownloader } from '@/lib/general';
import {
  BarChartOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Dropdown, Tooltip } from 'antd';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import HistogramBinsModal from '../charts/partials/HistogramBinsModal';

export default function GridWidget({
  title,
  widgetKey,
  chart,
  onRemove,
  isFilterable,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
}) {
  const [chartType, setChartType] = useState(chart.types[0]);
  const [modal, setModal] = useState({});
  const [options, setOptions] = useState({});

  const data = { ...options, ...chart };

  const resolveChartType = () => {
    let defaultType = chart.types[0];
    return chart.types.filter((t) => t !== chartType)[0] || defaultType;
  };

  const icons = {
    table: <TableOutlined />,
    pie: <PieChartOutlined />,
    histogram: <BarChartOutlined />,
  };

  const isHistogram = () => chartType.eq('histogram');

  const getItems = () => {
    const items = [];
    if (chart.types.length > 1) {
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
          key: 'download:data',
          label: 'Data',
        },
        {
          key: 'download:svg',
          label: 'SVG',
        },
      ],
    });

    return items;
  };

  const onChartOptions = (options) => {
    setOptions(options);
  };

  const widgetBodyId = `c-gridWidget__main--${crypto.randomUUID() + '-' + widgetKey}`;

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('switchChart:')) {
      const newType = key.split(':')[1];
      setChartType(newType);
    }
    if (key.eq('download:data')) {
      autoBlobDownloader(
        [JSON.jsonToCsv(data.data)],
        'text/csv;charset=utf-8;',
        `${title}.csv`,
      );
    }
    if (key.eq('download:svg')) {
      let svg = document.querySelector(
        `#${widgetBodyId} .VictoryContainer > svg`,
      ).outerHTML;
      // To make an SVG (Scalable Vector Graphic) display properly in Mac's Preview and Finder,
      // it must contain strict XML code. Victory svg doesn't contain the xmlns property so let's add it
      svg = svg.replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg"`);
      autoBlobDownloader([svg], 'image/svg+xml;charset=utf-8', `${title}.svg`);
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
    <Card
      className="c-gridWidget h-100"
      key={widgetKey}
      style={{ overflow: 'hidden' }}
    >
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

      <Card.Body
        className="d-flex flex-column"
        style={{ height: 0, flex: 1 }}
        id={widgetBodyId}
      >
        <ChartProvider>
          {/* // TODO: build over over legend table for pie chart */}
          <Chart
            data={data}
            chartType={chartType}
            isFilterable={isFilterable}
            activeFilters={activeFilters}
            onAddFilter={onAddFilter}
            onRemoveFilter={onRemoveFilter}
          />
        </ChartProvider>
      </Card.Body>
      {isHistogram() && (
        <HistogramBinsModal
          key={widgetKey}
          onChange={onChartOptions}
          modal={modal}
          setModal={setModal}
          options={data.options || {}}
        />
      )}
    </Card>
  );
}
