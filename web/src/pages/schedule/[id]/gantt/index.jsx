import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ScheduleGantt from '~/components/schedule-gantt'
import { useRouter } from 'next/router'
GanttChart.propTypes = {}
function GanttChart({ id }) {
  //   const router = useRouter()
  //   const [id, setId] = useState(0)
  //   useEffect(() => {
  //     const { id } = router.query
  //     setId(id)
  //   }, [])
  console.log(id)
  return (
    <div>
      <ScheduleGantt id={id}></ScheduleGantt>
    </div>
  )
}

export default GanttChart
