import React from 'react'
import { VictoryPie, VictoryTheme } from 'victory'

function Pie({data, layout}) {

  return (
    <div className='c-chart__pie'>
      <VictoryPie
   
        height={layout.h}
        data={data.data}
        theme={VictoryTheme.clean}
      />
    </div>
  )
}

export default Pie