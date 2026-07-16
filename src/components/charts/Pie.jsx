import React from 'react'
import { VictoryPie, VictoryTheme } from 'victory'

function Pie({data, layout}) {

  return (
    <div className='c-chart__pie'>
      <VictoryPie
        domainPadding={{ x: 10, y: 10 }}
        width={layout.w}
        height={layout.h - 40} // magic number for now.
        data={data.data}
        theme={VictoryTheme.clean}
      />
    </div>
  )
}

export default Pie