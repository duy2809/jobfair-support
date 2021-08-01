import React, { useState, useEffect, useCallback } from 'react'
import { Select, Table, Input, Button, Empty, AutoComplete } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import moment from 'moment'
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
    width: '6%',
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
    dataIndex: 'date',
    key: '参加日',
    render: (date) => formatDate(date),
  },
]

export default function MemberList() {
  const [members, setMembers] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)
  const [pagination, setPagination] = useState({ position: ['bottomCenter'], current: 1, pageSize: 10, showSizeChanger: false })

  const renderTitle = (title) => (
    <span>{title}</span>
  )

  const [filterData, setFilterData] = useState([])
  const [options, setOptions] = useState([{
    label: renderTitle('フルネーム'),
    options: [],
  },
  {
    label: renderTitle('メールアドレス'),
    options: [],
  },
  {
    label: renderTitle('参加日'),
    options: [],
  }])

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

  const searchData = (value) => {
    const result = members.filter((obj) => obj.name.toLowerCase().indexOf(value.toLowerCase()) > -1 || obj.email.toLowerCase().indexOf(value.toLowerCase()) > -1 || obj.created_at.indexOf(value) > -1)
    return result
  }

  const handleSearch = (value) => {
    const result = searchData(value)
    if (!value) {
      setFilterData(members)
      return
    }

    const setName = new Set()
    const setEmail = new Set()
    const setDate = new Set()

    const suggestionName = []
    const suggestionEmail = []
    const suggestionDate = []

    if (result != null) {
      for (let i = 0; i < result.length; i += 1) {
        if (result[i].name.toLowerCase().includes(value.toLowerCase())) {
          setName.add(result[i].name)
        } else if (result[i].email.toLowerCase().includes(value.toLowerCase())) {
          setEmail.add(result[i].email)
            .add(result[i].email)
        } else if (result[i].created_at.includes(value)) {
          setDate.add(moment(result[i].created_at).format('YYYY-MM-DD HH:mm:ss'))
        }
      }
    }
    setName.forEach((item) => {
      suggestionName.push({ value: item })
    })

    setEmail.forEach((item) => {
      suggestionEmail.push({ value: item })
    })

    setDate.forEach((item) => {
      suggestionDate.push({ value: item })
    })

    setOptions(value ? [{
      label: renderTitle('フルネーム'),
      options: suggestionName,
    },
    {
      label: renderTitle('メールアドレス'),
      options: suggestionEmail,
    },
    {
      label: renderTitle('参加日'),
      options: suggestionDate,
    }] : [])
    setFilterData(result)
  }

  const onSelect = (value) => {
    if (!value) {
      setOptions([])
      return
    }
    setFilterData(searchData(value))
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
    MemberApi.getListMember().then((res) => {
      const { data } = res
      setMembers(data)
      setFilterData(data)
    }).finally(() => {
      setDataLoading(false)
    })
  })
  const router = useRouter()
  const handleRow = (record) => ({ onClick: () => {
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
          <div className="text-5xl w-10/12 font-bold py-10 title" style={{ fontSize: '36px' }}>メンバ一覧</div>
          <div className="flex w-10/12 items-center justify-between">
            <div>
              <span className="text-xl">表示件数: </span>
              <Select className="ml-5" value={itemCount} onChange={handleSelect}>
                <Option value={10}>10</Option>
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
              </Select>
            </div>
            <div>
              <div className="text-2xl flex items-center">
                <AutoComplete
                  dropdownMatchSelectWidth={252}
                  options={options}
                  onSelect={onSelect}
                  onSearch={handleSearch}
                >
                  <Input placeholder="探索" prefix={<SearchOutlined />} />
                </AutoComplete>
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
          <Table
            className="w-10/12 rounded-3xl font-bold table-styled my-5 table-striped-rows"
            columns={columns}
            dataSource={filterData}
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
