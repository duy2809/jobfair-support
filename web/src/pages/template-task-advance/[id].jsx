/* eslint-disable no-new-object */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import {
  EditTwoTone,
  UserOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import { useRouter } from 'next/router'
import { Card, Row, Col, Button, Modal, notification } from 'antd'
import Otherlayout from '../../layouts/OtherLayout'
import Loading from '../../components/loading'
import Tree from '../../components/components-advance/tree'
import useTree from './useTree'
import './style.scss'
import { updateParent } from '../../api/template-advance'

const templateTaskAdvance = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const idSchedule = router.query.id
  const {
    SampleData,
    idMilestoneActive,
    setIdMileStoneActive,
    setSamleData,
    dataChartMilestone,
    setDataChartMilestone,
    dayMilestone,
  } = useTree(idSchedule)
  const [listData, setListData] = useState([])
  const onChangeTime = (value) => {}
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
  const saveNotification = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 3,
      onClick: () => {},
    })
  }
  const ErrorNotification = () => {
    notification.error({
      message: '変更は正常に保存されました。',
      duration: 3,
      onClick: () => {},
    })
  }
  const handSubmit = async () => {
    try {
      const task = []
      for (let index = 0; index < SampleData.length; index += 1) {
        for (let item = 0; item < SampleData[index].task.length; item += 1) {
          task.push(SampleData[index].task[item])
        }
      }
      const parent = []
      const task2 = task
      for (let index = 0; index < task.length; index += 1) {
        if (task[index].droppable) {
          const idTaskChil = []
          for (let item = 0; item < task2.length; item += 1) {
            if (task[index].id === task2[item].parent) {
              idTaskChil.push(task2[item].id)
              parent.push({ name: task[index].text, children: idTaskChil })
            }
          }
        }
      }
      // data chart
      const reTimeChart = dataChartMilestone.map((item) => ({
        milestone_id: item.milestone_id,
        template_tasks: Object.assign({}, ...item.template_tasks),
      }))
      const reParen = parent.filter(
        (value, index, self) => index === self.findIndex((t) => t.name === value.name),
      )
      const data = {
        schedule_id: idSchedule,
        parent: reParen,
        milestones: reTimeChart,
      }
      await updateParent(data)
        .then((response) => {
          if (response.status === 200) {
            router.push(`/schedule/${idSchedule}`)
            saveNotification()
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
            ErrorNotification()
          }
        })
    } catch (error) {
      notification.error({
        message: 'このJF名は既に使用されています。',
        duration: 3,
        onClick: () => {},
      })
    }
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
            <div className="m-4 item-center advance">
              <div style={{ width: '85%' }} className="item">
                <Card
                  bordered={false}
                  style={{
                    width: '100%',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  }}
                  className="status__global"
                >
                  <div>
                    <Tree
                      idSchedule={idSchedule}
                      onChangeTime={onChangeTime}
                      SampleData={SampleData}
                      setSamleData={setSamleData}
                      idMilestoneActive={idMilestoneActive}
                      setIdMileStoneActive={setIdMileStoneActive}
                      dayMilestone={dayMilestone}
                      dataChartMilestone={dataChartMilestone}
                      setDataChartMilestone={setDataChartMilestone}
                    />
                  </div>
                </Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} className="group-button mt-4">
                  <Button
                    htmlType="button"
                    type="primary"
                    onClick={cancelConfirmModle}
                    className="button_cacel mr-3"
                  >
                    キャンセル
                  </Button>
                  <Button type="primary" className="" onClick={handSubmit}>
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
