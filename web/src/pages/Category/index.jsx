/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './style.scss'

import { Input, Space } from 'antd'
import { AudioOutlined } from '@ant-design/icons'
import Item from 'antd/lib/list/Item'
import { getCategories, getCategory, searchCategory } from '../../api/category'

export default function listCategories() {
  const [category, setCategory] = useState([])
  const [sdata, setSdata] = useState([])
  const [Cname, setCname] = useState('')
  const { Search } = Input
  useEffect(async () => {
    getCategories().then((res) => {
      setCategory(res.data)
      console.log(res.data)
      console.log(category)
    }).catch((error) => console.log(error.response.request.response))
  }, [])

  // async function search(key) {
  //   searchCategory(key).then((res) => {
  //     console.log(res.data)
  //     setSdata(res.data)
  //     console.log(sdata)
  //   })
  // }
  useEffect(async () => {
    searchCategory(Cname).then((res) => {
      setSdata(res.data)
      console.log(res.data)
    })
  }, ['Cname'])

  return (
    <div>
      <h1>
        カテゴリ一覧
      </h1>
      <br />
      <div className="container">
        <Space direction="vertical">
          <Search placeholder="Category name" onChange={(e) => setCname(e.target.value)} style={{ width: 200 }} />
        </Space>
        <table>
          {
            sdata.map((item) => (
              <tr>
                <td>{item.category_name}</td>
              </tr>
            ))
          }
        </table>
      </div>
    </div>
  )
}
