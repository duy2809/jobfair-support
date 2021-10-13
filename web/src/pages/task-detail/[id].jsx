import React, { useEffect, useState, useContext } from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { Button, Modal, notification, Tooltip, Tag } from 'antd'
import {
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
  EditTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons'
import { ReactReduxContext } from 'react-redux'
import JfLayout from '../../layouts/layout-task'
import {
  taskData,
  beforeTask,
  afterTask,
  deleteTask,
} from '../../api/task-detail'
import Loading from '../../components/loading'

function TaskDetail() {
  const router = useRouter()
  const idTask = router.query.id
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const { store } = useContext(ReactReduxContext)
  const [beforeTasks, setBeforeTask] = useState([])
  const [afterTasks, setAfterTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [infoTask, setInfoTask] = useState({
    id: null,
    name: '',
    categories: '',
    milestone: '',
    status: '',
    start_time: '',
    end_time: '',
    effort: '',
    is_day: null,
    unit: '',
    description_of_detail: '',
  })
  const [infoJF, setInfoJF] = useState({
    id: null,
    name: '',
  })
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const [listMemberAssignee, setListMemberAssignee] = useState([])
  const deletetpl = async () => {
    setLoading(true)
    await deleteTask(idTask)
      .then(async (response) => {
        console.log(response.data)
        await router.push(`/tasks/${infoJF.id}`)
        await saveNotification()
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const fetchTaskData = async () => {
    await taskData(idTask)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data
          setInfoTask({
            id: data.id,
            name: data.name,
            categories: data.categories[0].category_name,
            milestone: data.milestone.name,
            status: data.status,
            start_time: data.start_time,
            end_time: data.end_time,
            effort: data.template_task.effort,
            is_day: data.template_task.is_day,
            unit: data.template_task.unit,
            description_of_detail: data.description_of_detail,
          })
          setListMemberAssignee(data.users)
          setInfoJF({
            id: data.schedule.jobfair.id,
            name: data.schedule.jobfair.name,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const fetchBeforeTask = async () => {
    await beforeTask(idTask)
      .then((response) => {
        setBeforeTask(response.data.before_tasks)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const fetchafterTask = async () => {
    await afterTask(idTask)
      .then((response) => {
        setAfterTasks(response.data.after_tasks)
      })
      .catch((error) => {
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
  const handleBack = () => {
    router.push(`/tasks/${infoJF.id}`)
  }
  const handleEdit = () => {
    router.push(`/edit-task/${infoTask.id}`)
  }

  useEffect(() => {
    setLoading(true)
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setRole(user.get('role'))
    }
    fetchTaskData()
    fetchBeforeTask()
    fetchafterTask()
    setLoading(false)
  }, [user])
  return (
    <div>
      {loading && <Loading loading={loading} overlay={loading} />}
      <JfLayout id={infoJF.id} bgr={2}>
        <JfLayout.Main>
          <div className="task-details">
            <div className="list__button">
              <div className="button__left">
                <Button
                  style={{ border: 'none' }}
                  type="primary"
                  onClick={handleBack}
                >
                  戻る
                </Button>
              </div>
            </div>
            <div className="title flex justify-between items-center">
              <h1>タスク詳細</h1>
              <div className="button__right mb-12 pb-2">
                {role === 'admin' || role === 'superadmin' ? (
                  <>
                    <EditTwoTone
                      className="border-none mx-1 text-2xl"
                      type="primary"
                      onClick={handleEdit}
                    >
                      {/* <EditOutlined /> */}
                    </EditTwoTone>
                    <DeleteTwoTone
                      className="border-none mx-1 text-2xl"
                      type="primary"
                      onClick={modelDelete}
                    >
                      {/* <DeleteOutlined /> */}
                    </DeleteTwoTone>
                  </>
                ) : null}
              </div>
            </div>

            <div className="info__tplt">
              <div className="grid grid-cols-2 mx-4 info__center">
                <div className="col-span-1 mx-4 ">
                  <div className="grid grid-cols-8 ">
                    <div className=" layber col-span-2 mx-4">
                      <p className="font-bold text-right">タスク名</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <div className="item__right">{infoTask.name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 ">
                  <div className="grid grid-cols-8 ">
                    <div className="layber  col-span-2 mx-4">
                      <p className="font-bold text-right">カテゴリ</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <div className="item__right">{infoTask.categories}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8 ">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">マイルストーン</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <div className="item__right">{infoTask.milestone}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8 ">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">工数</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      {infoTask.unit === 'none' ? (
                        <>
                          <span className="ef">{infoTask.effort}</span>
                          <span className="ef">
                            {infoTask.is_day ? '日' : '時間'}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="ef">{infoTask.effort}</span>
                          <span className="ef">
                            {infoTask.is_day ? '日' : '時間'}
                          </span>
                          <span>/</span>
                          {infoTask.unit === 'students' ? (
                            <span className="ef">学生数</span>
                          ) : (
                            <span className="ef">企業数</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">担当者</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <ul className="list__member">
                        {listMemberAssignee
                          ? listMemberAssignee.map((item) => (
                            <li className="task__chil">{`${item.name},`}</li>
                          ))
                          : null}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8 ">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">ステータス</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      {infoTask.status === '未着手' ? (
                        <span
                          style={{ background: '#5EB5A6', color: '#fff' }}
                          className=" stt item__right"
                        >
                          {infoTask.status}
                        </span>
                      ) : null}
                      {infoTask.status === '進行中' ? (
                        <span
                          style={{ background: '#A1AF2F', color: '#fff' }}
                          className=" stt item__right"
                        >
                          {infoTask.status}
                        </span>
                      ) : null}
                      {infoTask.status === '完了' ? (
                        <span
                          style={{ background: '#4488C5', color: '#fff' }}
                          className=" stt item__right"
                        >
                          {infoTask.status}
                        </span>
                      ) : null}
                      {infoTask.status === '中断' ? (
                        <span
                          style={{
                            background: 'rgb(185, 86, 86)',
                            color: '#fff',
                          }}
                          className=" stt item__right"
                        >
                          {infoTask.status}
                        </span>
                      ) : null}
                      {infoTask.status === '未完了' ? (
                        <span
                          style={{
                            background: 'rgb(121, 86, 23)',
                            color: '#fff',
                          }}
                          className=" stt item__right"
                        >
                          {infoTask.status}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8 ">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">開始日</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <span className="item__right">{infoTask.start_time}</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8 ">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">終了日</p>
                    </div>
                    <div className="col-span-6 mx-4">
                      <span className="item__right">{infoTask.end_time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mx-4 mt-5">
                <div className="col-span-1 mx-5 grid grid-cols-8 items-center">
                  <div className="layber col-span-2 mx-4">
                    <p className="font-bold text-right">前のタスク</p>
                  </div>
                  {beforeTasks.length > 0 ? (
                    <>
                      <ul
                        className="list__task col-span-6"
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        {beforeTasks
                          ? beforeTasks.map((item) => (
                            <li>
                              <Tag
                                style={{
                                  marginRight: 3,
                                  paddingTop: '5px',
                                  paddingBottom: '3px',
                                }}
                              >
                                <Tooltip placement="top" title={item.name}>
                                  <a
                                    href={`/task-detail/${item.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block text-blue-600 whitespace-nowrap "
                                  >
                                    {truncate(item.name)}
                                  </a>
                                </Tooltip>
                              </Tag>
                            </li>
                          ))
                          : null}
                      </ul>
                    </>
                  ) : (
                    <ul className="list__task col-span-6" />
                  )}
                </div>
                <div className="col-span-1 mx-8 grid grid-cols-8 items-center">
                  <div className="layber col-span-2 mx-4">
                    <p className="font-bold text-right">次のタスク</p>
                  </div>
                  {afterTasks.length > 0 ? (
                    <>
                      <ul
                        className="list__task col-span-6"
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        {afterTasks
                          ? afterTasks.map((item) => (
                            <li>
                              <Tag
                                style={{
                                  marginRight: 3,
                                  paddingTop: '5px',
                                  paddingBottom: '3px',
                                }}
                              >
                                <Tooltip placement="top" title={item.name}>
                                  <a
                                    href={`/task-detail/${item.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block text-blue-600 whitespace-nowrap "
                                  >
                                    {truncate(item.name)}
                                  </a>
                                </Tooltip>
                              </Tag>
                            </li>
                          ))
                          : null}
                      </ul>
                    </>
                  ) : (
                    <ul className="list__task col-span-6" />
                  )}
                </div>
              </div>

              <div className="mx-5 mt-5">
                <div className=" mx-7 des demo-infinite-container">
                  {infoTask.description_of_detail}
                </div>
              </div>
            </div>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
TaskDetail.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default TaskDetail
