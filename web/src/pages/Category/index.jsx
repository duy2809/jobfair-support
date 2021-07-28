/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import './style.scss'

import { Input, Space, Table } from 'antd'
import { getCategories, getCategory, searchCategory } from '../../api/category'
// import PrjAdd from './components/PrjAdd'
// import PrjEdit from './components/PrjEdit'
// import PrjDelete from './components/PrjDelete'
import Navbar from '../../components/navbar'

export default function listCategories() {
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sdata, setSdata] = useState([])
  const { Search } = Input
  useEffect(async () => {
    setLoading(true)
    getCategories().then((res) => {
      setCategory(res)
      console.log(res.data)
    }).catch((error) => console.log(error.response.request.response))
      .finally(() => {
        setLoading(false)
      })
  }, [])
  console.log(category)
  async function search(key) {
    searchCategory(key).then((res) => {
      const result = Object.values(res.data)
      setSdata(result)
      console.log(sdata)
    })
  }

  const columns = [
    {
      key: '1',
      title: 'ID',
      dataIndex: 'id',
      width: '10%',
    },
    {
      key: '2',
      title: 'カテゴリー名',
      dataIndex: 'title',
      width: '40%',
      sorter: (record1, record2) => record1.title < record2.title,
    },
    {
      key: '3',
      title: 'アクション',
      width: '20%',
      render: () => (
        <Space size="middle">
          {/* <PrjEdit />
          <PrjDelete /> */}
          Edit
          Delete
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex relative">
        <p className="p-8 font-bold text-4xl">カテゴリー覧</p>
        <div className="absolute right-12 top-10">
          <Space direction="vertical">
            <Search placeholder="search" onSearch={(e) => search(e.target.value)} style={{ width: 200 }} />
          </Space>
        </div>
      </div>
      <div className="list">
        <div className="flex pl-8 text-xl list-ht">
          <p>ディスプレイの数</p>
        </div>

        <Table
          loading={loading}
          columns={columns}
          dataSource={category.category_name}
          pagination={{
            current: page,
            pageSize,
            onChange: (page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            },
          }}
        />
        <div className="relative">
          {/* <PrjAdd /> */}
        </div>
      </div>
    </div>
  )
}
