import React from 'react'
import Pie from './Pie'

function Chart({data, children, containerClassName = '', ...otherProps}) {
    const charts = {
    pie: Pie,
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