import React, { useState, useEffect, useCallback } from 'react'
import { Select, Pagination, Input, Form, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Board from '../../components/board_listmember'
import Layout from '../../layouts/OtherLayout'

import { MemberApi } from '~/api/member'

export default function MemberList() {
  const [members, setMembers] = useState([])
  const [itemCount, setItemCount] = useState(10)
  const [dataLoading, setDataLoading] = useState(false)

  const handleSelect = (value) => {
    setItemCount(value)
  }

  const handleChange = (pageNumber, pageLimit) => {
    const result = members.slice((pageNumber - 1) * pageLimit, pageNumber * pageLimit)
    console.log(result)
  }

  const fetchData = useCallback(() => {
    setDataLoading(true)
    MemberApi.getListMember({ size: itemCount }).then((res) => {
      const { data } = res
      setMembers(data.data)
    }).finally(() => {
      setDataLoading(false)
    })
  })

  useEffect(() => {
    fetchData()
  }, [itemCount])
  const { Option } = Select
  const role = 'admin'
  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-full items-center justify-center bg-white-background">
          <div className="justify-start w-10/12">
            <div className="text-6xl font-bold py-10">メンバ一覧</div>
            <span className="text-xl">表示件数: </span>
            <Select className="ml-5" defaultValue={10} onChange={handleSelect}>
              <Option value={10}>10</Option>
              <Option value={25}>25</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>
          <div className="flex justify-between w-8/12">
            <div className="text-2xl ml-auto flex items-center">
              <Input placeholder="探索" prefix={<SearchOutlined />} />
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
          <Board data={members} isLoading={dataLoading} />
          <Pagination
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            total={members.length}
            onChange={handleChange}
            showQuickJumper
          />
        </div>
      </Layout.Main>
    </Layout>
  )
}
