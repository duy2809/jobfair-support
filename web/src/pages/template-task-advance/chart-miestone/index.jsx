/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { EditTwoTone, UserOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col, Slider } from 'antd'
import useTree from '../useTree'
import GroupMile from './group-milestone-task'

const chart = ({ idSchedule }) => {
  const { dataChartMilestone } = useTree(idSchedule)

  useEffect(() => {
    // setLoading(true)

    // setLoading(false)
  }, [])
  console.log(dataChartMilestone,"data")
  return (
    <>
      {
        dataChartMilestone && dataChartMilestone.map((item) => (
          <div>
            <GroupMile
              milestone={item.template_tasks}

            />

          </div>
        ))
      }

    </>
  )
}
export default chart
