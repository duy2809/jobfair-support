import React, { useEffect, useState, useContext } from 'react'
// import Swiper core and required modules
import { Modal, Button, notification, Spin } from 'antd'
import Navbar from '../../../components/navbar/index'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getSchedule, deleteSchedule } from '../../../api/schedule-detail'
import { ReactReduxContext } from 'react-redux'
import ScheduleDetail from './schedule-detail-list'
import { RightCircleOutlined } from '@ant-design/icons'
function ScheduleDetailGeneral(props) {
  const [status, setStatus] = useState(false) //false is lsit,true is gantt
  const [id, setID] = useState(0) //get ID
  const [scheduleName, setScheduleName] = useState('')
  const [role, setRole] = useState('member') //get Role
  const { store } = useContext(ReactReduxContext)
  const [user, setUser] = useState(null) //get User
  const router = useRouter() //router
  const [isModalVisible, setIsModalVisible] = useState(false) //state of Modal
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const { id } = router.query //get ID
    setID(id)
    getSchedule(id).then((res) => {
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
      .then((res) => {
        notification['success']({
          message: '成功',
          description: '正常に削除されました'
        })
        setTimeout(() => {
          router.push('/schedule')
        }, 3000)
      })
      .catch(() => {
        notification['error']({
          message: '失敗',
          description: '削除に失敗しました'
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
      <Spin spinning={loading}>
        <div className="px-12">
          <span className="text-3xl inline-block mt-4 " id="title">
            {scheduleName}
          </span>
          <div
            className="flex justify-end"
            style={{ visibility: role === 'admin' ? 'visible' : 'hidden' }}
          >
            <Button type="primary" size="default" className="mr-4" onClick={showModal}>
              削除
            </Button>
            <Modal title="削除" visible={isModalVisible} onOk={handleOk}>
              <p>削除してもよろしいですか？</p>
            </Modal>
            <Link href={`/schedule/${id}.edit`}>
              <Button type="primary" size="default">
                編集
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center	">
            <ScheduleDetail></ScheduleDetail>
            <span className="mb-12 ml-2">
              <RightCircleOutlined
                className="text-4xl gantt-chart inline cursor-pointer"
                onClick={changeScreen}
              />
            </span>
          </div>
        </div>
      </Spin>
    </div>
  )
}
ScheduleDetailGeneral.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default ScheduleDetailGeneral
