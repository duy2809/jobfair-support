/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import './style.scss'

import { Input, Space, Table, Pagination } from 'antd'
import { getCategories, addCategory, searchCategory } from '../../api/category'
import AddCategory from './components/AddCategory'
// import PrjEdit from './components/PrjEdit'
// import PrjDelete from './components/PrjDelete'
import Navbar from '../../components/navbar'

export default function listCategories() {
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageS, setPageS] = useState(10)
  const [sdata, setSdata] = useState([])
  const { Search } = Input
  const [isModalVisible, setIsModalVisible] = useState(false)
  // For add modal
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // fetch data
  useEffect(async () => {
    setLoading(true)
    getCategories().then((res) => {
      setCategory(res.data)
      console.log(res.data)
      console.log(category)
    }).catch((error) => console.log(error.response.request.response))
      .finally(() => {
        setLoading(false)
      })
  }, [])
  // search data with key
  async function search(key) {
    searchCategory(key).then((res) => {
      const result = Object.values(res.data)
      setSdata(result)
      console.log(sdata)
    })
  }
  // table columns
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
      dataIndex: 'category_name',
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
  // // add
  // onSubmit = (data) => {
  //   const { orgtableData } = this.state
  //   data.id = orgtableData.length + 1
  //   orgtableData.push(data)
  //   this.setState({
  //     orgtableData,
  //   })
  // }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex relative">
        <p className="p-8 font-bold text-4xl">カテゴリー覧</p>
        <div className="absolute right-12 top-10">
          <Space direction="vertical">
            <Search placeholder="search for category name" onSearch={(e) => search(e.target.value)} style={{ width: 200 }} />
          </Space>
        </div>
      </div>
      <div className="list">
        <div className="flex pl-8 text-xl list-ht">
          <p>表示件数: </p>
          &nbsp;
          <p>
            <select className="selectBox " onSelect>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </p>
        </div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={category}
          pagination={{
            defaultPageSize: 10,
            pageSize: pageS,
          }}
        />
        <div className="relative">
          <AddCategory />
        </div>
      </div>
    </div>
  )
}
