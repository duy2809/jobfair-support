import React from 'react'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('~/components/gantt-chart/Gantt'),
  { ssr: false },
)
const data = {
  data: [
    { id: 1, text: 'Task #1', start_date: '15-04-2019', users: 'ttan', duration: 3, progress: 0.6 },
    { id: 2, text: 'Task #2', start_date: '18-06-2019', users: 'ttan', duration: 3, progress: 0.4 },
    { id: 3, text: 'Task #2', start_date: '18-05-2019', users: 'ttan', duration: 3, progress: 0.4 },
    { id: 4, text: 'Task #2', start_date: '18-09-2019', users: 'ttan', duration: 3, progress: 0.4 },
    { id: 5, text: 'Task #2', start_date: '18-07-2019', users: 'ttan', duration: 3, progress: 0.4 },
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' },
  ],
}

export default function index() {
  return (
    <div>
      <div>
        <DynamicComponentWithNoSSR tasks={data} />
      </div>
    </div>
  )
}
