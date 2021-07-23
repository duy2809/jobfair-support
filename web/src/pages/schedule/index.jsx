import React, { useState, useEffect, useCallback } from 'react'
import { Select, Pagination, Input } from 'antd'
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Board from '../../components/Board'
import Layout from '../../layouts/OtherLayout'

import { ListScheduleApi } from '~/api/listschedule'

export default function ScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [filterschedules, setfilterSchedules] = useState([])
  const fetchData = useCallback(() => {
    ListScheduleApi.getListShedule().then((res) => {
      const { data } = res
      setSchedules(data)
      setfilterSchedules(data)
    })
  })

  const handleChange = (e) => {
    const result = schedules.filter((obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
    setfilterSchedules(result)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const { Option } = Select
  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-screen items-center justify-center bg-white-background">
          <div className="justify-start w-9/12">
            <span className="text-xl">表示件数:</span>
            <Select className="ml-5" defaultValue={10}>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>
          <div className="flex justify-between w-8/12">
            <div className="text-4xl font-bold mt-5 ml-12">JFスケジュール</div>
            <div className="text-2xl ml-auto flex items-center">
              <PlusCircleOutlined className="mx-8" />
              <Input placeholder="探索" onChange={handleChange} bordered prefix={<SearchOutlined />} />
            </div>
          </div>
          <Board data={filterschedules} />
          <Pagination
            total={85}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={20}
            defaultCurrent={1}
          />
        </div>
      </Layout.Main>
    </Layout>
  )
}
