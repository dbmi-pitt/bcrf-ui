import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tabula from './charts/Tabula';



const WidgetPopover = ({event, data, chartType}) => (
  <div className='c-widgetPopover'>
    <OverlayTrigger target={event.target} show={true} placement="auto" overlay={
    <Popover className='c-widgetPopover__main'>
    <Popover.Header as="h3">{data.title}</Popover.Header>
    <Popover.Body>
      <Tabula data={data} />
      {/* TODO Other charts */}
    </Popover.Body>
  </Popover>
  }>
    <span></span>
  </OverlayTrigger>
  </div>
);

export default WidgetPopover
