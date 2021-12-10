/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { EditTwoTone, UserOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col } from 'antd'
import Otherlayout from '../../layouts/OtherLayout'
import Loading from '../../components/loading'
import Tree from './components-advance/tree'

const templateTaskAdvance = () => {
  const [loading, setLoading] = useState(false)
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)

  const router = useRouter()
  useEffect(() => {
    // setLoading(true)

    // setLoading(false)
  }, [])
  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <h1 className="title">詳細設定</h1>
          {loading ? (
            <div className="flex flex-wrap content-center">
              <Loading loading={loading} overlay={loading} />
            </div>
          ) : (
            <div className="m-4">
              <Row gutter={[50, 50]}>
                <Col span={12}>
                  <Card bordered={false} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} className="status__global">
                    <div>
                      <Tree />
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={false} className="status__global">
               xvcb
                  </Card>
                </Col>
              </Row>

            </div>
          )}
        </Otherlayout.Main>
      </Otherlayout>
    </>
  )
}
templateTaskAdvance.middleware = ['auth:superadmin']
export default templateTaskAdvance
