import { DeleteTwoTone, EditTwoTone, RightCircleOutlined } from '@ant-design/icons'
// import Swiper core and required modules
import { Modal, notification, Spin } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import OtherLayout from '../../../layouts/OtherLayout'
import { deleteSchedule, getSchedule } from '../../../api/schedule-detail'
import { loadingIcon } from '../../../components/loading'
import GanttChart from './gantt'
import ScheduleDetail from './list'

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
        router.push('/schedule')
        notification.success({
          message: '成功',
          description: '正常に削除されました',
          duration: 3,
        })
      })
      .catch(() => {
        notification.error({
          message: '失敗',
          description: '削除に失敗しました',
          duration: 3,
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
    <OtherLayout>
      <OtherLayout.Main>
        <div className="px-12 h-full">
          <div className="flex items-center justify-between">
            <div />
            <h1 className="my-5 text-2xl font-bold" style={{ color: '#272343' }}>
              {scheduleName}
            </h1>
            <div
              className="flex justify-end"
              style={{ visibility: role === 'superadmin' ? 'visible' : 'hidden' }}
            >
              <Link href={`/jf-schedule/${id}/edit`}>
                <EditTwoTone className="border-none mx-1 text-2xl" />
              </Link>
              <DeleteTwoTone onClick={showModal} className="border-none mx-1 text-2xl" />
              <Modal title="削除" visible={isModalVisible} onOk={handleOk}>
                <p>削除してもよろしいですか？</p>
              </Modal>
            </div>
          </div>

          <Spin spinning={loading} indicator={loadingIcon}>
            <div className="mt-12 relative h-full">
              {status ? <GanttChart id={id} /> : <ScheduleDetail />}
            </div>
          </Spin>
        </div>
        <span className="mb-12 ml-2 ">
          <RightCircleOutlined
            className="text-4xl gantt-chart inline cursor-pointer absolute bottom-1/2"
            style={{ right: '40px', marginBottom: !status ? '1.5%' : '0' }}
            onClick={changeScreen}
          />
        </span>
      </OtherLayout.Main>
    </OtherLayout>
  )
}
ScheduleDetailGeneral.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default ScheduleDetailGeneral
