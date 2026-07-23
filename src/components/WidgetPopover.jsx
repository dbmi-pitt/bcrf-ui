import { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Tabula from './charts/Tabula';

const WidgetPopover = ({ event, data, chartType, targetRef }) => {
  const [show, setShow] = useState(null);

  useEffect(() => {
    const halfScreen = window.innerWidth / 2;
    setTimeout(() => {
      const atLeft = event.clientX <= halfScreen;
      if (atLeft) {
        setShow('right');
      } else {
        setShow('left');
      }
    }, 500);
  }, []);

  return (
    <div className="c-widgetPopover">
      <OverlayTrigger
        target={event.target}
        show={show !== null}
        placement={show}
        overlay={
          <Popover className="c-widgetPopover__main">
            <Popover.Header as="h3">{data.title}</Popover.Header>
            <Popover.Body>
              <Tabula data={data} />
            </Popover.Body>
          </Popover>
        }
      >
        {/* The component is rendered after a mouse event, so ignore linter on ref */}
        <span style={{width: targetRef.current.offsetWidth, display: 'block', position: 'absolute'}}>&nbsp;</span>
      </OverlayTrigger>
    </div>
  );
};

export default WidgetPopover;
