import React, { useEffect, useState, useContext } from 'react'
// import Swiper core and required modules
import { Modal, Button, notification, Spin } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ReactReduxContext } from 'react-redux'
import { RightCircleOutlined } from '@ant-design/icons'
import { getSchedule, deleteSchedule } from '../../../api/schedule-detail'
import ScheduleDetail from './list'
import Navbar from '../../../components/navbar/index'
import GanttChart from './gantt'

function ScheduleDetailGeneral() {
  const [status, setStatus] = useState(false) // false is lsit,true is gantt
  const [id, setID] = useState(0) // get ID
  const [scheduleName, setScheduleName] = useState('')
  const [role, setRole] = useState('member') // get Role
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null) // get User
  const router = useRouter() // router
  const [isModalVisible, setIsModalVisible] = useState(false) // state of Modal
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // get ID
    setID(router.query.id)
    getSchedule(router.query.id).then((res) => {
      setScheduleName(res.data.name)
    })
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      console.log()
      setRole(user.get('role'))
    }
    // alert(role);
  }, [user])
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)

    deleteSchedule(id)
      .then(() => {
        notification.success({
          message: '成功',
          description: '正常に削除されました',
        })
        setTimeout(() => {
          router.push('/schedule')
        }, 3000)
      })
      .catch(() => {
        notification.error({
          message: '失敗',
          description: '削除に失敗しました',
        })
      })
  }
  const changeScreen = () => {
    setLoading(true)
    setTimeout(() => {
      setStatus(!status)
      setLoading(false)
    }, 3000)
  }

  return (
    <div className="app">
      <header>
        <Navbar />
      </header>
      <div className="px-12">
        <span className="text-3xl inline-block mt-4 " id="title">
          {scheduleName}
        </span>
        <div
          className="flex justify-end"
          style={{ visibility: role === 'superadmin' ? 'visible' : 'hidden' }}
        >
          <Button
            type="primary"
            size="default"
            className="mr-4"
            onClick={showModal}
          >
            削除
          </Button>
          <Modal title="削除" visible={isModalVisible} onOk={handleOk}>
            <p>削除してもよろしいですか？</p>
          </Modal>
          <Link href={`/jf-schedule/${id}/edit`}>
            <Button type="primary" size="default">
              編集
            </Button>
          </Link>
        </div>
        <Spin spinning={loading}>
          <div className="mt-12 relative">
            {status ? <GanttChart id={id} /> : <ScheduleDetail />}
            <span className="mb-12 ml-2">
              <RightCircleOutlined
                className="text-4xl gantt-chart inline cursor-pointer absolute bottom-1/2"
                style={{ right: '-4%', marginBottom: !status ? '1.5%' : '0' }}
                onClick={changeScreen}
              />
            </span>
          </div>
        </Spin>
      </div>
    </div>
  )
}
ScheduleDetailGeneral.middleware = [
  'auth:superadmin',
  'auth:admin',
  'auth:member',
]
export default ScheduleDetailGeneral
