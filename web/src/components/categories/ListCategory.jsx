/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useContext, useEffect, useState, useRef } from 'react'
import { ReactReduxContext } from 'react-redux'
import 'antd/dist/antd.css'
// import List from '../list'

import { Input, Space, Table, Row, Col, Select, Button, Tooltip } from 'antd'
import { LineHeightOutlined, SearchOutlined } from '@ant-design/icons'
import { element } from 'prop-types'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory'
import { getCategories, searchCategory } from '../../api/category'
import './style.scss'

export default function ListCategories() {
  const [pageS, setPageS] = useState(10)
  const { store } = useContext(ReactReduxContext)
  const [reload, setReload] = useState(false)
  const [category, setCategory] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const role = store.getState().get('auth').get('user').get('role')
  const ref = useRef()
  // fetch data
  // useEffect(async () => {
  //   setReload(false)
  //   getCategories().then((res) => {
  //     setCategory(res.data)
  //   }).catch((error) => console.log(error.response.request.response))
  // }, [reload])

  // search data with key
  async function fetch(key) {
    if (key) {
      searchCategory(key).then((res) => {
        const result = Object.values(res.data)
        setCategory(result)
      })
    } else {
      // setReload(true)
      getCategories().then((res) => {
        setCategory(res.data)
      })
    }
    setSearchValue(key)
  }

  useEffect(() => {
    getCategories().then((res) => {
      setCategory(res.data)
    })
  }, [])

  // set reload state
  const reloadPage = () => {
    // setReload(true)
    getCategories().then((res) => {
      setCategory(res.data)
    })
  }
  // table columns
  const columns = [
    {
      key: '1',
      title: 'カテゴリー名',
      dataIndex: 'name',
      width: '60%',
      render: (name) => (
        <>
          {name.length > 50
            ? (
              <Tooltip placement="top" title={name}>
                <span
                  className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                  style={{ maxWidth: '50ch' }}
                >
                  {name}
                </span>
              </Tooltip>
            ) : (
              <span
                className="text-sm inline-block cursor-pointer whitespace-nowrap overflow-hidden overflow-ellipsis"
                style={{ maxWidth: '50ch' }}
              >
                {name}
              </span>
            )}
        </>
      ),
    },
    {
      key: '2',
      title: 'アクション',
      width: '25%',
      render: (record) => (role === 'superadmin' && (
        <Space size="middle">
          <EditCategory
            record={record}
            reloadPage={reloadPage}
            role={role}
          />
          <DeleteCategory
            record={record}
            reloadPage={reloadPage}
            role={role}
          />
        </Space>
      )),
    },
  ]

  const [data, setData] = useState([])
  useEffect(() => {
    setData(category.map((element) => ({
      key: element.id,
      id: element.id,
      name: element.category_name,
    })))
  }, [category])
  return (
    <div className="list-category">
      <Row
        style={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Col>
          <h1>カテゴリー覧</h1>
        </Col>
        <Col>
          <div className="add">
            {role === 'superadmin' && (
              <AddCategory reloadPage={reloadPage} role={role} />)}
          </div>
        </Col>
      </Row>

      <div className="list">
        <div className="flex text-xl list-ht">
          <p>表示件数: </p>
          &nbsp;
          <p>
            <Select
              labelInValue
              defaultValue={{ value: '10' }}
              style={{ width: 60, borderRadius: '1rem' }}
              onChange={(e) => setPageS(e.value)}
              className="selectBox"
            >
              <Select.Option value="10">10</Select.Option>
              <Select.Option value="25">25</Select.Option>
              <Select.Option value="50">50</Select.Option>
            </Select>
          </p>
          <p>
            <div className="absolute right-12 no-border">
              <Space direction="vertical">
                {/* <Input
                  placeholder="カテゴリを検索"
                  onChange={(e) => fetch(e.target.value)}
                  // style={{ width: 250 }}
                  value={searchValue}
                  bordered
                  prefix={<SearchOutlined />}
                /> */}
                <div ref={ref}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div className="flex items-center">
                      <span className="queue-demo">
                        <span>
                          <Input
                            placeholder="カテゴリを検索"
                            onChange={(e) => fetch(e.target.value)}
                            value={searchValue}
                            bordered
                            prefix={<SearchOutlined />}
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Space>
            </div>
          </p>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: pageS }}
          className="mt-4"
        />
      </div>
    </div>
  )
}
