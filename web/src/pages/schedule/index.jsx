/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useCallback } from 'react'
import { Select, Input, Table, Empty, Button, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Layout from '../../layouts/OtherLayout'
import { webInit } from '~/api/web-init'

import { ListScheduleApi } from '~/api/schedule'

const columns = [
  {
    title: 'No.',
    dataIndex: 'key',
    key: 'No.',
    width: '5%',
    render: (id) => id,
  },
  {
    title: 'スケジュール',
    dataIndex: 'name',
    key: 'スケジュール',
    width: '95%',
    render: (name) => <Tooltip title={name}>{name}</Tooltip>,
  },
]

function ScheduleList() {
  const [schedules, setSchedules] = useState([])
  const [filterSchedules, setFilterSchedules] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({
    position: ['bottomCenter'],
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  const [user, setUser] = useState({})
  const router = useRouter()
  const handleSelect = (value) => {
    setPagination((preState) => ({
      ...preState,
      pageSize: value,
    }))
    setItemCount(value)
    localStorage.setItem('pagination', JSON.stringify({ ...pagination, pageSize: value }))
  }

  const handleChange = (e) => {
    setPagination((preState) => ({
      ...preState,
      current: e.current,
    }))
  }

  const handleInput = (e) => {
    const result = schedules.filter(
      (obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1,
    )
    setFilterSchedules(result)
  }

  const initPagination = () => {
    const paginationData = JSON.parse(localStorage.getItem('pagination'))
    if (paginationData === null) {
      localStorage.setItem('pagination', JSON.stringify(pagination))
    } else {
      setPagination((preState) => ({
        ...preState,
        pageSize: paginationData.pageSize,
      }))
      setItemCount(paginationData.pageSize)
    }
  }

  const fetchData = useCallback(() => {
    setDataLoading(true)
    initPagination()
    webInit().then((res) => {
      if (res.data.auth != null) {
        setUser(res.data.auth.user)
      }
    })
    ListScheduleApi.getListSchedule()
      .then((res) => {
        const { data } = res
        setSchedules(data)
        setFilterSchedules(data)
      })
      .finally(() => {
        setDataLoading(false)
      })
  })

  // fix No. bug
  const Schedules = []
  for (let i = 0; i < filterSchedules.length; i += 1) {
    Schedules.push({
      key: i + 1,
      id: filterSchedules[i].id,
      name: filterSchedules[i].name,
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push('/jf-schedule/add')
  }

  const handleRow = (record) => ({
    onClick: () => {
      router.push(`/schedule/${record.id}`)
    },
  })

  useEffect(() => {
    fetchData()
  }, [itemCount])
  const { Option } = Select
  const role = user.role
  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="flex w-full justify-between">
            <h1 className="ml-0">JFスケジュール一覧</h1>
          </div>
          <div className="flex w-full justify-between">
            <div
              className="flex items-center content-center"
              // t qua bat luc voi code  r day nen t moi phai inline style nhu nay :)
              style={{ height: '38px' }}
            >
              <span>表示件数 </span>
              <Select
                size="large"
                className="ml-2 flow-root"
                value={itemCount}
                onChange={handleSelect}
              >
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div>
              <div className="text-2xl ml-auto flex items-center">
                <Input
                  placeholder="スケジュール"
                  onChange={handleInput}
                  bordered
                  prefix={<SearchOutlined />}
                />
                <div className="pl-5">
                  {role === 'superadmin' ? (
                    <Button
                      type="primary"
                      htmlType="button"
                      enabled
                      onClick={handleClick}
                      style={{ letterSpacing: '-0.1em' }}
                    >
                      追加
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
          <Table
            className="rounded-3xl table-styled my-5 table-striped-rows"
            columns={columns}
            dataSource={Schedules}
            rowKey={(record) => record.id}
            scroll={{ y: 360 }}
            onRow={handleRow}
            onChange={handleChange}
            loading={dataLoading}
            pagination={pagination}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="該当結果が見つかりませんでした"
                />
              ),
            }}
          />
        </div>
      </Layout.Main>
    </Layout>
  )
}

ScheduleList.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default ScheduleList
