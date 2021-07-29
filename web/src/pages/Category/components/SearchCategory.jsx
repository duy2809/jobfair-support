/* eslint-disable no-console */
import React from 'react'
import 'antd/dist/antd.css'
import { Input, Space } from 'antd'

const { Search } = Input

const onSearch = (value) => console.log(value)

const PrjSearch = () => (
  <Space direction="vertical" className="pr-12">
    <Search placeholder="カテゴリを検索" onSearch={onSearch} style={{ width: 200 }} />
  </Space>
)

export default PrjSearch
