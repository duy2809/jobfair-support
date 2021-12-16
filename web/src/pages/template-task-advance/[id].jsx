/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import { EditTwoTone, UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col, Button, Modal } from 'antd'
import Otherlayout from '../../layouts/OtherLayout'
import Loading from '../../components/loading'
import Tree from './components-advance/tree'
import useTree from './useTree'
import './style.scss'
// import ChartMilestone from './chart-miestone'

const templateTaskAdvance = () => {
  const [loading, setLoading] = useState(false)
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null)

  const router = useRouter()
  const idSchedule = router.query.id
  const { SampleData } = useTree(idSchedule)
  const onChangeTime = (value) => {
    console.log(value, 'value')
    console.log(SampleData, 'samplae')
  }
  useEffect(() => {
    // setLoading(true)

    // setLoading(false)
  }, [])
  const cancelConfirmModle = () => {
    Modal.confirm({
      title: '変更内容が保存されません。よろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      centered: true,
      onOk: () => {
        router.push('/jf-schedule/add')
      },

      onCancel: () => {},
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  const handSubmit = () => {
    console.log('heheheh')
  }
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
                      onChangeTime={onChangeTime}
                    />
                  </div>
                </Card>

                {/* <Card bordered={false} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }} className="status__global">
                <ChartMilestone
                  idSchedule={idSchedule}
                />
              </Card> */}
                <div className="group-button mt-4">
                  <Button
                    htmlType="button"
                    type="primary"
                    onClick={cancelConfirmModle}
                    className="button_cacel mr-3"
                  >
                      キャンセル
                  </Button>
                  <Button
                    type="primary"
                    className=""
                    onClick={handSubmit}
                  >
                    <span> 保存 </span>
                  </Button>
                </div>
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
