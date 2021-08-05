/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import '../style.scss'

import { Input, Space, Table, Pagination, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory'
import { getCategories, searchCategory } from '../../../api/category'

export default function ListCategories() {
  const [pageS, setPageS] = useState(10)
  // const [sdata, setSdata] = useState([])
  const [reload, setReload] = useState(false)
  const [category, setCategory] = useState([])
  const { Search } = Input
  const [searchValue, setSearchValue] = useState('')

  // fetch data
  useEffect(async () => {
    setReload(false)
    getCategories().then((res) => {
      setCategory(res.data)
      // console.log(res.data)
      // console.log(category)
    }).catch((error) => console.log(error.response.request.response))
  }, [reload])
  // search data with key
  async function fetch(key) {
    if (key) {
      searchCategory(key).then((res) => {
        const result = Object.values(res.data)
        setCategory(result)
        console.log('res:', result)
        console.log(res)
      })
    } else {
      setReload(true)
    }
    setSearchValue(key)
  }

  // table columns
  const columns = [
    {
      title: 'No',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      render: (id) => id,
    },
    {
      key: '2',
      title: 'カテゴリー名',
      dataIndex: 'category_name',
      width: '60%',
      sorter: (record1, record2) => record1.category_name > record2.category_name,
    },
    {
      key: '3',
      title: 'アクション',
      width: '25%',
      render: (record) => (
        <Space size="middle">
          <EditCategory
            record={record}
          />
          <DeleteCategory
            record={record}
          />
        </Space>
      ),
    },
  ]

  // const data = []
  // for (let i = 0; i < sdata.length; i += 1) {
  //   data.push({
  //     key: i,
  //     id: sdata[i].id,
  //     title: sdata[i].title,
  //   })
  // }

  function setPageSize(selectObject) {
    setPageS(selectObject.value)
  }

  return (
    <div>
      <div className="flex relative">
        <h1 className="p-8 font-bold text-4xl">カテゴリー覧</h1>
        <div className="add">
          <AddCategory />
        </div>
      </div>

      <div className="list">
        <div className="flex pl-8 text-xl list-ht">
          <p>表示件数: </p>
          &nbsp;
          <p>
            <Select
              labelInValue
              defaultValue={{ value: '10' }}
              style={{ width: 60, borderRadius: '1rem' }}
              onChange={(e) => setPageS(e.value)}
            >
              <Select.Option value="10">10</Select.Option>
              <Select.Option value="25">25</Select.Option>
              <Select.Option value="50">50</Select.Option>
            </Select>
          </p>
          <p>
            <div className="absolute right-12">
              <Space direction="vertical" className="pl-12">
                <Input
                  placeholder="カテゴリを検索"
                  onChange={(e) => fetch(e.target.value)}
                  style={{ width: 250, height: 40 }}
                  value={searchValue}
                  // onPressEnter={(e) => search(searchValue)}
                  prefix={<SearchOutlined />}
                />
              </Space>
            </div>
          </p>
        </div>
        <Table
          columns={columns}
          dataSource={category}
          pagination={{ pageSize: pageS }}
          scroll={{ y: 510 }}
        />
      </div>
    </div>
  )
}
