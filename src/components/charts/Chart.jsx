import React, { useEffect, useRef, useState } from 'react';
import Pie from './Pie';
import Histogram from './BarHistogram';
import Tabula from './Tabula';
import Scatter from './Scatter';

function Chart({
  data,
  chartType,
  children,
  containerClassName = '',
  ...otherProps
}) {
  const charts = {
    pie: Pie,
    histogram: Histogram,
    scatter: Scatter,
    table: Tabula,
  };

  const DisplayChart = charts[chartType];

  const containerRef = useRef(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  if (!DisplayChart) return <>Invalid chart</>;
  return (
    <div
      ref={containerRef}
      className={`c-chart ${containerClassName}`}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <DisplayChart
        data={data}
        width={size.width}
        height={size.height}
        {...otherProps}
      />
      {children}
    </div>
  );
}

export default Chart;
