import React, { useEffect, useState } from 'react'
import './style.scss'
import { useRouter } from 'next/router'

import { Button, Modal, notification } from 'antd'
import {
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'
import JfLayout from '../../layouts/JFLayout'
import NotificationsJf from '../../components/notifications-jf'
import ChartStatus from '../../components/chart-status'
import ChartMilestone from '../../components/chart-milestone'
import { jfdata, jftask, deleteJF } from '../../api/jf-toppage'
import SearchSugges from '../../components/search-sugges'
import { webInit } from '../../api/web-init'

export default function jftoppage() {
  const [listTask, setlistTask] = useState([])
  const [name, setName] = useState('')
  const router = useRouter()
  const idJf = router.query.JFid
  const [users, setUsers] = useState('')
  const [startDate, setStartDate] = useState()
  const [user, setuser] = useState('')
  const [numberOfStudents, setNumberOfStudents] = useState()
  const [numberOfCompanies, setNumberOfCompanies] = useState()
  const fetchJF = async () => {
    await jfdata(idJf).then((response) => {
      setName(response.data.name)
      setStartDate(response.data.start_date.split('-').join('/'))
      setuser(response.data.user.name)
      setNumberOfStudents(response.data.number_of_students)
      setNumberOfCompanies(response.data.number_of_companies)
    }).catch((error) => {
      console.log(error)
    })
  }
  const getDataUser = async () => {
    await webInit().then((response) => {
      setUsers(response.data.auth.user.role)
      console.log(response.data.auth.user.role)
    }).catch((error) => {
      console.log(error)
    })
  }
  const fetchTasks = async () => {
    await jftask(idJf).then((response) => {
      setlistTask(response.data.schedule.tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  const handleEdit = () => {
    router.push(`/edit-jf/${idJf}`)
  }
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const deletetpl = async () => {
    await deleteJF(idJf).then((response) => {
      console.log(response.data)
      saveNotification()
      router.push('/jobfairs')
    }).catch((error) => {
      console.log(error)
    })
  }
  const modelDelete = () => {
    Modal.confirm({
      title: '削除してもよろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      onOk: () => {
        deletetpl()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  useEffect(() => {
    localStorage.setItem('id-jf', idJf)
    fetchJF()
    fetchTasks()
    getDataUser()
  }, [])

  return (
    <div className="JFTopPage">
      <JfLayout id={idJf}>
        <JfLayout.Main>
          <div className="Jf__top">
            <div className="Jf__header">
              <h1>{name}</h1>
              <div className="admin__jf">
                <div className="admin__top">
                  <div className="grid grid-cols-2">
                    <div className="col-span-1">
                      <h3 className="bo">{startDate}</h3>
                      <h3>
                        {`企業:${numberOfStudents}`}
                      </h3>
                    </div>
                    <div className="col-span-1">
                      <h3 className="bo">{user}</h3>
                      <h3>
                        {`学生:${numberOfCompanies}`}
                      </h3>
                    </div>

                  </div>

                </div>
              </div>
            </div>
            <div className="jf__main">
              <div className="grid grid-cols-11">
                <div className="col-span-7">
                  <div className="notifi">
                    <div className="title">
                      <h3 className="title-h3">
                        最近の更新
                      </h3>
                      <NotificationsJf id={idJf} />
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex justify-end">
                    <div className="search__task">
                      <div className="button__right">
                        { users === 'admin' ? (
                          <>
                            <Button className="button__edit" style={{ border: 'none' }} type="primary" onClick={handleEdit}>編集</Button>
                            <Button style={{ border: 'none' }} type="primary" onClick={modelDelete}>削除</Button>
                          </>
                        )
                          : null}
                      </div>
                    </div>
                  </div>
                  <div className="progress">

                    <div className="flex cha justify-center ...">
                      <div className="search__task">
                        <SearchSugges listTask={listTask} id={idJf} />
                      </div>
                    </div>
                    <div className="chart__tt">
                      <div className="flex justify-center ...">
                        <div className="status__global">
                          <h3>ステータス</h3>
                          <div className="status">
                            <ChartStatus task={listTask} id={idJf} />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center ...">
                        <div className="status__global">
                          <h3>マイルストーン</h3>
                          <div className="status">
                            <ChartMilestone id={idJf} />
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
