/* eslint-disable no-console */
/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css'
import '../assets/style/PrjList.css'
import { Table, Space } from 'antd'
import PrjAdd from './PrjAdd'
import PrjEdit from './PrjEdit'
import PrjDelete from './PrjDelete'

function PrjList() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    setLoading(true)
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((data) => {
        setData(data)
      }).catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const columns = [
    {
      key: '1',
      title: 'No',
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
          <PrjEdit />
          <PrjDelete />
        </Space>
      ),
    },
  ]

  return (
    <div className="list">
      <div className="flex pl-8 text-xl list-ht">
        <p>ディスプレイの数</p>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
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
        <PrjAdd />
      </div>
    </div>
  )
}

export default PrjList
