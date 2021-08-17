import React, { useState, useEffect, useCallback } from 'react'
import { Select, Table, Input, Button, Empty, Form, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import moment from 'moment'
import Layout from '../../../layouts/OtherLayout'
import { formatDate } from '~/utils/utils'
import * as Extensions from '../../../utils/extensions'
import { MemberApi } from '~/api/member'
import { webInit } from '~/api/web-init'
import './style.scss'

const columns = [
  {
    title: 'No.',
    key: 'No.',
    dataIndex: 'id',
    render: (value, item, index) => index + 1,
    width: '10%',
  },
  {
    title: 'タスク名',
    dataIndex: 'name',
    key: 'タスク名',
    width: '30%',
    render: (name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`,
  },
  {
    title: 'ステータス',
    key: 'ステータス',
    dataIndex: 'status',
    width: '30%',
    render: (email) => email,
  },
  {
    title: '終了時間',
    key: '終了時間',
    dataIndex: 'end_time',
    render: (date) => formatDate(date),
  },
]

export default function TaskList() {
  const { Option } = Select
  const router = useRouter()
  const [tasks, setTasks] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [user, setUser] = useState({})
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], current: 1, pageSize: 10, showSizeChanger: false })
  const [optionStatus, setOptionStatus] = useState('すべて')

  const [searchNameValue, setSearchNameValue] = useState('')
  const [searchDateValue, setSearchDateValue] = useState('')
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

  const check = (obj) => {
    if (optionStatus === 'すべて') {
      return true
    }
    return obj.status.trim() === optionStatus.trim()
  }

  const handleInput = () => {
    const result = tasks.filter((obj) => obj.name.toLowerCase().indexOf(searchNameValue.toLowerCase()) > -1
      && obj.end_time.toLowerCase().indexOf(searchDateValue.toLowerCase()) > -1
      && check(obj))
    setFilteredData(result)
  }

  const fetchData = useCallback(() => {
    setDataLoading(true)
    initPagination()
    webInit().then((res) => {
      if (res.data.auth != null) {
        setUser(res.data.auth.user)
        MemberApi.getTasksOfMember(res.data.auth.user.id).then((response) => {
          const { data } = response
          setFilteredData(data)
          setTasks(data)
        }).catch((error) => {
          console.log(error)
          router.push('/login')
        })
      } else {
        router.push('/login')
      }
    }).finally(() => {
      setDataLoading(false)
    })
  })

  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }

  const handleRow = (record) => ({ onClick: () => {
    router.push(`/member/${record.id}`)
  } })

  const handleBackButton = () => {
    router.push(`/member/${user.id}`)
  }

  const handleSelectStatus = (value) => {
    setOptionStatus(value.target.innerText)
  }

  const handleInputName = (e) => {
    setSearchNameValue(e.target.value)
  }

  const handleInputDate = (value) => {
    setSearchDateValue(moment(value).format('YYYY/MM/DD'))
  }

  useEffect(() => {
    fetchData()
  }, [itemCount])

  useEffect(() => {
    handleInput()
  }, [optionStatus, searchNameValue, searchDateValue])
  return (
    <Layout>
      <Layout.Main>
        <div>
          <Button
            type="primary"
            className="my-5"
            htmlType="button"
            enabled
            onClick={handleBackButton}
          >
            戻る
          </Button>
        </div>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="text-5xl w-full flex justify-between items-center title">
            <div className="my-4">メンバ詳細（タスク一覧）</div>
          </div>
          <div className="text-xl w-full flex justify-start items-center title">
            <div className="my-5 mr-5">ステータス:</div>
            <Button onClick={handleSelectStatus} className={`mx-5 ${optionStatus === 'すべて' ? 'option-active' : ''}`}>すべて</Button>
            <Button onClick={handleSelectStatus} className={`mx-5 ${optionStatus === '未着手' ? 'option-active' : ''}`}>未着手</Button>
            <Button onClick={handleSelectStatus} className={`mx-5 ${optionStatus === '進行中' ? 'option-active' : ''}`}>進行中</Button>
            <Button onClick={handleSelectStatus} className={`mx-5 ${optionStatus === '完 了' ? 'option-active' : ''}`}>完了</Button>
            <Button onClick={handleSelectStatus} className={`mx-5 ${optionStatus === '中 断' ? 'option-active' : ''}`}>中断</Button>
            <Button onClick={handleSelectStatus} className={`mx-5 ${optionStatus === '未完了' ? 'option-active' : ''}`}>未完了</Button>
          </div>
          <div className="flex my-4 w-full items-center justify-start">
            <Form className="flex items-center">
              <Form.Item
                className="mr-4"
              >
                <Input size="large" onChange={handleInputName} placeholder="タスク名" prefix={<SearchOutlined />} />
              </Form.Item>
              <Form.Item
                name="start_date"
                rules={[
                  {
                    validator: startDayValidator,
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  help="Please select the correct date"
                  format={Extensions.dateFormat}
                  placeholder={Extensions.dateFormat}
                  onChange={handleInputDate}
                />
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-start w-full">
            <span className="text-xl">表示件数: </span>
            <Select className="ml-5" value={itemCount} onChange={handleSelect}>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>
          <Table
            className="w-full rounded-3xl table-styled my-5 table-striped-rows"
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            scroll={{ y: 360 }}
            onRow={handleRow}
            onChange={handleChange}
            loading={dataLoading}
            pagination={pagination}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="該当結果が見つかりませんでした" /> }}
          />
        </div>
      </Layout.Main>
    </Layout>
  )
}
