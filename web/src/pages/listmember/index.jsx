import React, { useState } from 'react'
import { Select, Pagination, Input, Form, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Board3 from '../../components/board_listmember'
import Layout from '../../layouts/OtherLayout'

const data = [

  {
    key: '2',
    Stt: '1',
    Name: 'tho',
    Email: 'thopham@gamil.com',
    Time: '21/7/2021',
  },
  {
    key: '3',
    Stt: '2',
    Name: 'tho',
    Email: 'thopham@gamil.com',
    Time: '21/7/2021',
  },
  {
    key: '4',
    Stt: '3',
    Name: 'tho',
    Email: 'thopham@gamil.com',
    Time: '21/7/2021',
  },
  {
    key: '5',
    Stt: '4',
    Name: 'tho',
    Email: 'thopham@gamil.com',
    Time: '21/7/2021',
  },
]

export default function MemberList() {
  const [isSearch, setIsSearch] = useState(false)
  const [filteredData, setFilteredData] = useState(data)
  const handleInput = () => {
    setIsSearch(!isSearch)
  }

  const handleChange = (e) => {
    const result = data.filter((obj) => Object.keys(obj).some((key) => obj[key].toLowerCase().indexOf(e.target.value.toLowerCase()) > -1))
    setFilteredData(result)
  }
  const { Option } = Select
  const role = 'admin'

  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-screen items-center justify-center bg-white-background">
          <div className="justify-start w-9/12">
            <div className="text-6xl font-bold mb-20 -ml-24">メンバ一覧</div>
            <span className="text-xl">表示件数:</span>
            <Select className="ml-5" defaultValue={10}>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>
          <div className="flex justify-between w-8/12">
            <div className="text-2xl ml-auto flex items-center">
              <SearchOutlined onClick={handleInput} hidden={isSearch} />
              <Input placeholder="探索" onChange={handleChange} className={!isSearch ? 'hidden' : ''} prefix={<SearchOutlined />} />
              { role === 'admin' ? (
                <>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="button"
                      className="mt-5 ml-5"
                      enabled
                    >
                      メンバー招待
                    </Button>
                  </Form.Item>
                </>
              ) : ''}
            </div>
          </div>
          <Board3 data={filteredData} />
          <Pagination
            total={85}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            defaultPageSize={20}
            defaultCurrent={1}
          />
        </div>
      </Layout.Main>
    </Layout>
  )
}
