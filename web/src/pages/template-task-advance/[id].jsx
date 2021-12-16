/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { EditTwoTone, UserOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col,Button } from 'antd'
import Otherlayout from '../../layouts/OtherLayout'
import Loading from '../../components/loading'
import Tree from './components-advance/tree'
import './style.scss'
// import ChartMilestone from './chart-miestone'

const templateTaskAdvance = () => {
  const [loading, setLoading] = useState(false)
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)

  const router = useRouter()
  const idSchedule = router.query.id
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
            <div className="m-4 item-center">
              <div style={{ width: '75%' }} className="item">
                <Card bordered={false} style={{ width: '100%', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} className="status__global">
                  <div>
                    <Tree
                      idSchedule={idSchedule}
                    />
                  </div>
                </Card>

                {/* <Card bordered={false} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} className="status__global">
                <ChartMilestone
                  idSchedule={idSchedule}
                />
              </Card> */}
              <Button>asfsdf</Button>
              </div>
            </div>
          )}
        </Otherlayout.Main>
      </Otherlayout>
    </>
  )
}
templateTaskAdvance.middleware = ['auth:superadmin']
export default templateTaskAdvance
