import React, { useState, useEffect, useCallback } from 'react'
import { Select, Table, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import Layout from '../../layouts/OtherLayout'
import { formatDate } from '~/utils/utils'
import './styles.scss'

import { MemberApi } from '~/api/member'

const columns = [
  {
    title: 'No.',
    key: 'No.',
    dataIndex: 'id',
    render: (id) => id,
    width: '5%',
  },
  {
    title: 'フルネーム',
    dataIndex: 'name',
    key: 'フルネーム',
    width: '30%',
    render: (name) => `${name.slice(0, 1).toUpperCase()}${name.slice(1)}`,
  },
  {
    title: 'メールアドレス',
    key: 'メールアドレス',
    dataIndex: 'email',
    width: '50%',
    render: (email) => email,
  },
  {
    title: '参加日',
    dataIndex: '参加日',
    key: '参加日',
    render: (date) => formatDate(date),
  },
]

export default function MemberList() {
  const [members, setMembers] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], current: 1, pageSize: 10 })
  const [filterData, setFilterData] = useState([])

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
    const result = members.filter((obj) => obj.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
    setFilterData(result)
  }

  const fetchData = useCallback(() => {
    setDataLoading(true)
    MemberApi.getListMember({ size: itemCount }).then((res) => {
      const { data } = res
      setMembers(data)
      setFilterData(data)
    }).finally(() => {
      setDataLoading(false)
    })
  })
  const router = useRouter()
  const handleRow = (record) => ({ onClick: () => {
    console.log(record)
    router.push(`/member/${record.id}`)
  } })
  const handleClick = (e) => {
    e.preventDefault()
    router.push('/member/invite')
  }

  useEffect(() => {
    fetchData()
  }, [itemCount])
  const { Option } = Select
  const role = 'admin'
  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="text-6xl w-10/12 font-bold py-10">メンバ一覧</div>
          <div className="flex w-10/12 items-center justify-between">
            <div>
              <span className="text-xl">表示件数: </span>
              <Select className="ml-5" defaultValue={10} onChange={handleSelect}>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div>
              <div className="text-2xl flex items-center">
                <Input placeholder="探索" prefix={<SearchOutlined />} onChange={handleInput} />
                { role === 'admin' ? (
                  <Button
                    type="primary"
                    className="ml-5"
                    htmlType="button"
                    enabled
                    onClick={handleClick}
                  >
                    メンバー招待
                  </Button>
                ) : ''}
              </div>
            </div>
          </div>
          <Table className="w-10/12 rounded-3xl font-bold table-styled my-5 table-striped-rows" dataSource={filterData} onRow={handleRow} pagination={pagination} columns={columns} isLoading={dataLoading} onChange={handleChange} />
        </div>
      </Layout.Main>
    </Layout>
  )
}
