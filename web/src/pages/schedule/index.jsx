import React, { useState, useEffect, useCallback } from 'react'
import { Select, Input, Table } from 'antd'
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons'
import Layout from '../../layouts/OtherLayout'
import './styles.scss'

import { ListScheduleApi } from '~/api/schedule'

const columns = [
  {
    title: 'No.',
    key: 'No.',
    dataIndex: 'id',
    render: (id) => id,
    width: '5%',
  },
  {
    title: 'スケジュール',
    dataIndex: 'name',
    key: 'スケジュール',
    width: '95%',
    render: (name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`,
  },
]

export default function ScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [filterSchedules, setFilterSchedules] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], current: 1, pageSize: 10 })

  const fetchData = useCallback(() => {
    setDataLoading(true)
    ListScheduleApi.getListShedule().then((res) => {
      const { data } = res
      setSchedules(data)
      setFilterSchedules(data)
    }).finally(() => {
      setDataLoading(false)
    })
  })

  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
  }

  const handleChange = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: e.current,
    }))
  }

  const handleInput = (e) => {
    const result = schedules.filter((obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
    setFilterSchedules(result)
  }

  useEffect(() => {
    fetchData()
  }, [itemCount])
  const { Option } = Select
  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="justify-start w-10/12">
            <span className="text-xl">表示件数: </span>
            <Select className="ml-5" defaultValue={10} onChange={handleSelect}>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>
          <div className="flex justify-between w-10/12">
            <div className="text-2xl ml-auto flex items-center">
              <PlusCircleOutlined className="mx-8" />
              <Input placeholder="探索" onChange={handleInput} bordered prefix={<SearchOutlined />} />
            </div>
          </div>
          <Table className="w-10/12 rounded-3xl font-bold table-styled my-5 table-striped-rows" dataSource={filterSchedules} pagination={pagination} columns={columns} isLoading={dataLoading} onChange={handleChange} />
        </div>
      </Layout.Main>
    </Layout>
  )
}
