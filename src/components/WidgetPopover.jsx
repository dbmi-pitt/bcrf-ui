import { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tabula from './charts/Tabula';

const WidgetPopover = ({ event, data, chartType }) => {
  const [show, setShow] = useState(null);

  useEffect(() => {
    const margin = 500;
    const e = event;
    setTimeout(() => {
      const atLeft = e.clientX <= margin;
      const atRight = e.clientX >= window.innerWidth - margin;
      const atTop = e.clientY <= margin;
      const atBottom = e.clientY >= window.innerHeight - margin;

      if (atLeft || atRight || atTop || atBottom) {
        console.log('Mouse is at the screen boundary!', atLeft, atRight);
      }

      if (atLeft) {
        setShow('bottom-end');
      } else {
        setShow('left');
      }
    }, 500);
  }, []);


  return (
    <div className="c-widgetPopover">
      <OverlayTrigger
        // target={event.target}
        show={show != null}
        placement={show}
        overlay={
          <Popover className="c-widgetPopover__main">
            <Popover.Header as="h3">{data.title}</Popover.Header>
            <Popover.Body>
          
              <Tabula data={data} />
              {/* TODO Other charts */}
            </Popover.Body>
          </Popover>
        }
      >
        <span>&nbsp;</span>
      </OverlayTrigger>
    </div>
  );
};

export default WidgetPopover;
