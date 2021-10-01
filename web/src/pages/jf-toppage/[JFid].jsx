import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { ReactReduxContext } from 'react-redux'
// import { notification } from 'antd'
// import {
//   ExclamationCircleOutlined,
//   CheckCircleTwoTone,
// } from '@ant-design/icons'
import JfLayout from '../../layouts/layout-task'
import NotificationsJf from '../../components/notifications-jf'
import ChartStatus from '../../components/chart-status'
import ChartMilestone from '../../components/chart-milestone'
import { jftask } from '../../api/jf-toppage'
import SearchSugges from '../../components/search-sugges'

function jftoppage() {
  const [listTask, setlistTask] = useState([])

  const router = useRouter()
  const idJf = router.query.JFid
  const [user, setUser] = useState(null)
  // const [role, setRole] = useState(null)
  const { store } = useContext(ReactReduxContext)
  const fetchTasks = async () => {
    await jftask(idJf).then((response) => {
      setlistTask(response.data.schedule.tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  // const handleEdit = () => {
  //   router.push(`/edit-jf/${idJf}`)
  // }
  // const saveNotification = () => {
  //   notification.open({
  //     icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
  //     duration: 3,
  //     message: '正常に削除されました',
  //     onClick: () => {},
  //   })
  // }
  // const deletetpl = async () => {
  //   await deleteJF(idJf).then((response) => {  //remove edit and delete
  //     console.log(response.data)
  //     saveNotification()
  //     router.push('/jobfairs')
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }
  // const modelDelete = () => {
  //   Modal.confirm({
  //     title: '削除してもよろしいですか？',
  //     icon: <ExclamationCircleOutlined />,
  //     content: '',
  //     onOk: () => {
  //       deletetpl()
  //     },
  //     onCancel: () => {},
  //     centered: true,
  //     okText: 'はい',
  //     cancelText: 'いいえ',
  //   })
  // }
  useEffect(() => {
    localStorage.setItem('id-jf', idJf)
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      // setRole(user.get('role'))
    }
    fetchTasks()
  }, [user])

  return (
    <div className="JFTopPage">
      <JfLayout id={idJf} bgr={1}>
        <JfLayout.Main>
          <div className="Jf__top">

            <div className="jf__main">
              <div className="grid grid-cols-12">
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
                <div className="col-span-5">
                  <div className="flex justify-end">
                    <div className="search__task">
                      <div className="button__right">
                        {/* {role === 'superadmin' ? (
                          <>
                            <Button className="button__edit" style={{ border: 'none' }} type="primary" onClick={handleEdit}>
                              <span> 編集 </span>
                            </Button>
                            <Button style={{ border: 'none' }} type="primary" onClick={modelDelete}>
                              <span> 削除 </span>
                            </Button>
                          </>
                        )
                          : null} */}
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
jftoppage.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default jftoppage
