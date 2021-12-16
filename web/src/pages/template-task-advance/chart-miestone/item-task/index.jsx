/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { EditTwoTone, UserOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col, Slider } from 'antd'
import './style.scss'

const chart = ({ father }) => {
  useEffect(() => {
  }, [])
  const onChange = (value) => {
    console.log(value, 'change')
  }
  const onAfterChange = (value) => {
    console.log(value, 'afterchange')
  }
  return (
    <div className="item-task my-1">
      <Slider
        range
        step={7}
        max={100}
        defaultValue={father === -1 ? [0, 50] : [50, 100]}
        onChange={onChange}
        onAfterChange={onAfterChange}
      />

    </div>
  )
}
export default chart
