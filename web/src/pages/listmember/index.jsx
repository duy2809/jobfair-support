import React, { useState, useEffect, useCallback } from 'react'
import { Select, Pagination, Input, Form, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Board3 from '../../components/board_listmember'
import Layout from '../../layouts/OtherLayout'

import { MemberApi } from '~/api/member'

export default function MemberList() {

  const [members, setMembers] = useState([])

  const fetchData = useCallback (() => {
    MemberApi.getListMember().then(res => {
      const { data } = res;
      console.log(data)
      setMembers(data)
    })
  })

  useEffect(() => {
    fetchData();
  }, [])

  const { Option } = Select
  const role = 'admin'
  return (
    <Layout>
      <Layout.Main>
        <div className="flex flex-col h-screen items-center justify-center bg-white-background">
          <div className="justify-start w-9/12">
            <div className="text-6xl font-bold mb-20 -ml-24">メンバ一覧</div>
            <span className="text-xl">表示件数: </span>
            <Select className="ml-5" defaultValue={10}>
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
          <Board3 data={members} />
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