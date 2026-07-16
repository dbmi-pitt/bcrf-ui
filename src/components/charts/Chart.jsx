import React from 'react'
import Pie from './Pie'
import Histogram from './Histogram'
import Tabula from './Tabula'
import Scatter from './Scatter'

function Chart({data, children, containerClassName = '', ...otherProps}) {
    const charts = {
    pie: Pie,
    histogram: Histogram,
    scatter: Scatter,
    table: Tabula
  }
  
  const DisplayChart = charts[data.types[0]]
  if (!DisplayChart) return <>Invalid chart</>
  return (
    <div className={`c-chart ${containerClassName}`} >
      <DisplayChart data={data} {...otherProps} />
      {children}
    </div>
  )
}

export default Chart