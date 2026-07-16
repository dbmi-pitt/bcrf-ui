import React from 'react'
import Pie from './Pie'
import Histogram from './Histogram'
import Tabula from './Tabula'
import Scatter from './Scatter'

function Chart({data, chartType, children, containerClassName = '', ...otherProps}) {
    const charts = {
    pie: Pie,
    histogram: Histogram,
    scatter: Scatter,
    table: Tabula
  }
  
  const DisplayChart = charts[chartType]
  if (!DisplayChart) return <>Invalid chart</>
  return (
    <div className={`c-chart ${containerClassName}`} >
      <DisplayChart data={data} {...otherProps} />
      {children}
    </div>
  )
}

export default Chart