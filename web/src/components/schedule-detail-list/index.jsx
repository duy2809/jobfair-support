import React from 'react'
import { Button } from 'antd'
import { RightCircleOutlined } from '@ant-design/icons'
import Navbar from '../../components/navbar/index'
import Link from 'next/link'

function ScheduleDetailHeader(props) {
  const { id } = props
  return (
    <div>
      <Navbar className="navbar" />
      <div className="px-12">
        <div className="flex justify-between mt-5 mb-4">
          <Link href="/schedule">
            <Button type="primary" id="back_btn">
              戻る
            </Button>
          </Link>
          <Link href={`/schedule/gantt-chart/${id}`}>
            <RightCircleOutlined className="gantt-chart text-4xl gantt-chart_btn" />
          </Link>
        </div>
        <span className="text-3xl inline-block mb-4 " id="title">
          JFスケジュール詳細
        </span>
      </div>
    </div>
  )
}

export default ScheduleDetailHeader
