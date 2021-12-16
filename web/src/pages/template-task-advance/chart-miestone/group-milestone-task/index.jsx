/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { EditTwoTone, UserOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col, Slider } from 'antd'
import ItemTask from '../item-task/index'

const Group = ({ milestone }) => {
  useEffect(() => {
    // setLoading(true)

    // setLoading(false)
  }, [])
  const after = []
  for (let index = 0; index < milestone.length; index += 1) {
    for (let item = 0; item < milestone[index].afterTasks.length; item += 1) {
      after.push(milestone[index].afterTasks[item])
    }
  }
  return (
    <div className="my-10">
      {milestone && milestone.map((item) => {
        const father = after.indexOf(item.id)
        return (
          <div>
            <ItemTask
              father={father}
            />
          </div>
        )
      })}
    </div>
  )
}
export default Group
