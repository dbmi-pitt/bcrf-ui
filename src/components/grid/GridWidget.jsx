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
import { useState,  useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import WidgetPopover from '../WidgetPopover';

export default function GridWidget({
  title,
  widgetKey,
  chart,
  onChartTypeChange,
  onRemove,
  isFilterable,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  legend,
  setLegend
}) {
  const [chartType, setChartType] = useState(chart.types[0]);
  const [widgetPopover, setShowWidgetPopover] = useState(null)
  const widgetRef = useRef(null)
  const [showActions, setShowActions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const data = { ...chart };

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

  const widgetBodyId = `c-gridWidget__main--${crypto.randomUUID() + '-' + widgetKey}`;

  const handleMenuClick = ({ key }) => {
    if (key.startsWith('switchChart:')) {
      const newType = key.split(':')[1];
      setChartType(newType);
      onChartTypeChange(widgetKey, newType);
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
   
  };

  const menuProps = {
    items: getItems(),
    onClick: handleMenuClick,
  };

  return (
    <Card
      className="c-gridWidget h-100"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!menuOpen) {
          setShowActions(false);
        }
      }}
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

        <div
          className="d-flex align-items-center gap-2"
          style={{
            opacity: showActions ? 1 : 0,
            transition: 'opacity .15s ease',
          }}
        >
          <Tooltip title={'Test tooltip'}>
            <InfoCircleOutlined />
          </Tooltip>

          <Dropdown
            menu={menuProps}
            open={menuOpen}
            onOpenChange={(open) => {
              setMenuOpen(open);

              if (open) {
                setShowActions(true);
              } else {
                setShowActions(false);
              }
            }}
          >
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
        className="d-flex flex-column c-gridWidget__main"
        style={{ height: 0, flex: 1, padding: 1 }}
        id={widgetBodyId}
        ref={widgetRef}
        onMouseOver={(e) => setShowWidgetPopover(e)}
        onMouseOut={(e) => setShowWidgetPopover(null)}
      >
        <ChartProvider 
            isFilterable={isFilterable}
            activeFilters={activeFilters}
            onAddFilter={onAddFilter}
            onRemoveFilter={onRemoveFilter} 
            legend={legend} 
            setLegend={setLegend}
            >
     
          <Chart
            data={data}
            chartType={chartType}
          />
          {widgetPopover && chartType.eq('pie') && <WidgetPopover event={widgetPopover} data={data} targetRef={widgetRef}
            chartType={chartType}  />}
        </ChartProvider>
      </Card.Body>
    </Card>
  );
}
