import React, { useState } from 'react';
import { Responsive, useContainerWidth } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GridWidget from '@/components/grid/GridWidget';

const STORAGE_KEY = 'grid-layout';

const defaultData = [
  { title: 'A', key: 'a' },
  { title: 'B', key: 'b' },
  { title: 'C', key: 'c' },
];

const defaultLayouts = {
  lg: [
    { i: 'a', x: 0, y: 0, w: 4, h: 4 },
    { i: 'b', x: 4, y: 0, w: 4, h: 4 },
    { i: 'c', x: 8, y: 0, w: 4, h: 4 },
  ],
};

const breakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};

const cols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};

export default function GridLayout() {
  const { width, containerRef, mounted } = useContainerWidth();
  const [items, setItems] = useState(defaultData);
  // Use default layout but if localstorage contains modifications load that
  const [layouts, setLayouts] = useState(defaultLayouts);

  // We can reenable this to load modifications from localstorage. This interferes with removing items.
  // useEffect(() => {
  //   const saved = localStorage.getItem(STORAGE_KEY);
  //   if (saved) {
  //     setLayouts(JSON.parse(saved));
  //   }
  // }, []);

  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);

    // We can reenable this to load modifications from localstorage. This interferes with removing items.
    //   // Save modified layout to localstorage
    //   localStorage.setItem(STORAGE_KEY, JSON.stringify(allLayouts));
  };

  const handleRemoveItem = (widgetKey) => {
    setItems((prev) => prev.filter((item) => item.key !== widgetKey));

    setLayouts((prevLayouts) => {
      const updatedLayouts = {};

      Object.keys(prevLayouts).forEach((breakpoint) => {
        updatedLayouts[breakpoint] = prevLayouts[breakpoint].filter(
          (layoutItem) => layoutItem.i !== widgetKey,
        );
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayouts));

      return updatedLayouts;
    });
  };

  return (
    <div ref={containerRef}>
      {mounted && (
        <Responsive
          width={width}
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={30}
          onLayoutChange={handleLayoutChange}
        >
          {items.map((item) => (
            <div key={item.key}>
              <GridWidget
                title={item.title}
                widgetKey={item.key}
                key={item.key}
                onRemove={() => handleRemoveItem(item.key)}
              />
            </div>
          ))}
        </Responsive>
      )}
    </div>
  );
}
