import React from 'react'
// import { Gantt, DefaultTheme as MatterialTheme } from '@dhtmlx/trial-react-gantt'
import Gantt from './test'
// import { columns, scales, tasks, links } from './data'

export default function IndexPage() {
  return (
    <div style={{ height: '900px' }}>
      {/* <MatterialTheme>
        <Gantt scales={scales} columns={columns} tasks={tasks} links={links} />
      </MatterialTheme> */}
      <Gantt />
    </div>
  )
}
