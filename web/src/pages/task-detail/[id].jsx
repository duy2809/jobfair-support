/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, notification, Table, Tooltip } from 'antd'
// import Editt from './editor'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import { afterTask, beforeTask, deleteTask, getRoleTask, taskData } from '~/api/task-detail'
import Comment from '~/components/comment/index'
import Loading from '~/components/loading'
import JfLayout from '~/layouts/layout-task'
import { reviewers } from '../../api/edit-task'
import StatusStatic from '../../components/status/static-status'
import './style.scss'

const StackEditor = dynamic(
  () => import('../../components/stackeditor').then((mod) => mod.default),
  { ssr: false },
)

function TaskDetail() {
  const router = useRouter()
  const idTask = router.query.id
  const [role, setRole] = useState(null)
  const { store } = useContext(ReactReduxContext)
  const [beforeTasks, setBeforeTask] = useState([])
  const [afterTasks, setAfterTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const idUser = store.getState().get('auth').get('user').get('id')
  const [roleTask, setRoleTask] = useState('member')
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
  const [childTask, setChildTask] = useState([])
  const [newAsigneesFromNewComment, setNewAsigneesFromNewComment] = useState([])
  const [taskStatus, setTaskStatus] = useState(infoTask.status)
  const [tempStatus, setTempStatus] = useState()
  const [action, setAction] = useState('none')
  const [memberChangeStatus, setMemberChangeStatus] = useState('')
  const [infoJF, setInfoJF] = useState({
    id: null,
    name: '',
  })
  const [jfInfo, setJfInfo] = useState({})
  const saveNotification = () => {
    notification.success({
      duration: 3,
      message: '正常に削除されました',
      onClick: () => {},
    })
  }
  const [listMemberAssignee, setListMemberAssignee] = useState([])
  const deletetpl = async () => {
    setLoading(true)
    await deleteTask(idTask)
      .then(() => {
        router.push(`/tasks/${infoJF.id}`)
        saveNotification()
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const getChildProps1 = useCallback((childState) => {
    const copyState = {}
    Object.assign(copyState, childState)
    if (copyState.new_assignees.length > 0) {
      setNewAsigneesFromNewComment(copyState.new_assignees)
      setAction('none')
    }
    if (copyState.new_status !== '') {
      setTaskStatus(copyState.new_status)
      setTempStatus(copyState.new_status)
      setAction(copyState.action)
      setListMemberAssignee(copyState.updateListMember)
    }
  }, [])
  const getChildProps2 = useCallback((childState) => {
    const copyState = {}
    Object.assign(copyState, childState)
    if (copyState.new_member_status !== '') {
      setTempStatus(copyState.new_member_status)
      setAction(copyState.action)
      setMemberChangeStatus(copyState.member)
      setListMemberAssignee(copyState.updateListMember)
    }
  }, [])
  const getRole = (id) => {
    const user = store.getState().get('auth').get('user')
    if (user.get('id') === id) {
      setRole('admin')
    } else {
      setRole(user.get('role'))
    }
  }
  const getRoleWithTask = async (idJF) => {
    await getRoleTask(idJF, idUser, idTask)
      .then((res) => {
        setRoleTask(res.data)
      })
      .catch((error) => Error(error.toString()))
  }
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const generateChildTask = (tasks) => tasks.map((task) => ({
    key: task.id,
    name: task.name,
    start_time: task.start_time,
    end_time: task.end_time,
    status: task.status,
  }))
  const fetchTaskData = async () => {
    await taskData(idTask)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data
          console.log(data)
          const categoryName = []
          const { children } = response.data
          if (children) {
            // setChildTask(children)
            setChildTask(generateChildTask(children) ?? [])
          }
          setJfInfo(data.schedule.jobfair)
          response.data.categories.forEach((element) => {
            categoryName.push(element.category_name)
          })
          getRole(data.schedule.jobfair.jobfair_admin_id)
          setInfoTask({
            id: data.id,
            name: data.name,
            categories: categoryName,
            milestone: data.milestone.name,
            status: data.status,
            start_time: data.start_time,
            end_time: data.end_time,
            effort: data.template_task.effort,
            is_day: data.template_task.is_day,
            unit: data.template_task.unit,
            description_of_detail: data.description_of_detail.replace(
              /<a/g,
              '<a target="_blank" ',
            ),
            is_parent: data.is_parent,
          })
          setTaskStatus(data.status)
          setListMemberAssignee(data.users)
          setInfoJF({
            id: data.schedule.jobfair.id,
            name: data.schedule.jobfair.name,
          })
          getRoleWithTask(data.schedule.jobfair.id, idUser, idTask)
        }
        // set role task
      })
      .catch((error) => {
        console.log(error)
        // router.push('/404')
      })
  }
  const fetchBeforeTask = async () => {
    await beforeTask(idTask)
      .then((response) => {
        setBeforeTask(response.data.before_tasks)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        } else router.push('/error')
      })
  }
  const fetchAfterTask = async () => {
    await afterTask(idTask)
      .then((response) => {
        setAfterTasks(response.data.after_tasks)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        } else router.push('/error')
      })
  }
  const [reviewersList, setReviewersList] = useState([])
  const fetchReviewersList = async () => {
    await reviewers(idTask)
      .then((response) => {
        setReviewersList(response.data)
      })
      .catch((error) => {
        if (error.response.status === 404) {
          router.push('/404')
        } else router.push('/error')
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
  // const handleBack = () => {
  //   router.push(`/tasks/${infoJF.id}`)
  // }
  const handleEdit = () => {
    router.push(`/edit-task/${infoTask.id}`)
  }

  const columns = [
    {
      title: 'タスク名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Link href={`/task-detail/${record.key}`}>
          <a target="_blank">{text}</a>
        </Link>
      ),
    },
    { title: '開始日', dataIndex: 'start_time', key: 'start_time' },
    { title: '終了日', dataIndex: 'end_time', key: 'end_time' },
    {
      title: 'スターテス',
      dataIndex: 'status',
      key: 'status',
    },
  ]

  useEffect(() => {
    setLoading(true)
    fetchTaskData()
    fetchBeforeTask()
    fetchAfterTask()
    fetchReviewersList()
    setLoading(false)
  }, [role, router.query.id])
  const assigneeNames = listMemberAssignee.map((assignee) => assignee.id)

  return (
    <div>
      {loading && <Loading loading={loading} overlay={loading} />}
      <JfLayout id={infoJF.id} bgr={2}>
        <JfLayout.Main>
          <div className="task-details">
            <div className="title flex justify-between items-center">
              <h1>タスク詳細</h1>
              <div className="button__right mb-12 pb-2">
                {role === 'admin' && infoTask.is_parent !== 1 ? (
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
                      <div className="item__right">
                        {infoTask.categories ? infoTask.categories.join(', ') : null}
                      </div>
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
                          <span className="ef">{infoTask.is_day ? '日' : '時間'}</span>
                        </>
                      ) : (
                        <>
                          <span className="ef">{infoTask.effort}</span>
                          <span className="ef">{infoTask.is_day ? '日' : '時間'}</span>
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
                {/* {listMemberAssignee.length == 1? (<></>):
                } */}

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

              { infoTask.is_parent !== 1 && (
                <div className="grid grid-cols-2 mx-4 mt-5">
                  <div className="col-span-1 mx-5 grid grid-cols-8">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">前のタスク</p>
                    </div>
                    {beforeTasks?.length > 0 ? (
                      <>
                        <ul className="ml-5 task_list">
                          {beforeTasks
                            ? beforeTasks.map((item) => (
                              <li className="mb-3">
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
                              </li>
                            ))
                            : null}
                        </ul>
                      </>
                    ) : (
                      <ul className="list__task col-span-6" />
                    )}
                  </div>
                  <div className="col-span-1 mx-8 grid grid-cols-8">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">次のタスク</p>
                    </div>
                    {afterTasks?.length > 0 ? (
                      <>
                        <ul className="ml-5 task_list">
                          {afterTasks
                            ? afterTasks.map((item) => (
                              <li className="mb-3">
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
              ) }
              { infoTask.is_parent !== 1 && (
                <div className="grid grid-cols-2 mx-4">
                  <div className="col-span-1 mx-4 mt-5">
                    <div className="grid grid-cols-8">
                      <div className="layber col-span-2 mx-4">
                        <p className="font-bold text-right">担当者</p>
                      </div>
                      <div className="col-span-5 mx-4">
                        <table>
                          {newAsigneesFromNewComment.length > 0
                        && action === 'none'
                            ? newAsigneesFromNewComment
                            && newAsigneesFromNewComment.map((item, index) => {
                              const id = index + item
                              return (
                                <>
                                  <tr key={id} className="task__chil">
                                    <td>{`${item}`}</td>
                                    {newAsigneesFromNewComment.length === 1 ? (
                                      <td />
                                    ) : (
                                      <td>
                                        <StatusStatic status="未着手" />
                                      </td>
                                    )}
                                  </tr>
                                  <br />
                                </>
                              )
                            })
                            : listMemberAssignee
                            && listMemberAssignee.map((item) => (
                              <>
                                <tr key={item.id} className="task__chil">
                                  <td>{`${item.name}`}</td>
                                  {/* {roleTask ===
                                    `taskMember${item.pivot.user_id}` ||
                                  roleTask === "jfadmin" ||
                                  roleTask === "reviewer" ? (
                                    <Status
                                      status={`${item.pivot.status}`}
                                      user_id={`${item.pivot.user_id}`}
                                      task_id={`${infoTask.id}`}
                                      set_task_status={setTaskStatus}
                                      roleTask={roleTask}
                                    />
                                  ) : (
                                    <StatusStatic
                                      status={`${item.pivot.status}`}
                                    />
                                  )} */}
                                  {listMemberAssignee.length === 1
                                  || !(taskStatus === '未着手' || taskStatus === '進行中') ? (
                                      <td />
                                    ) : (
                                      <>
                                        <td>
                                          {action === 'changeTaskStatus' ? (
                                            <>
                                              <StatusStatic status={tempStatus} />
                                            </>
                                          ) : (
                                            <>
                                              {action === 'changeMemberStatus'
                                            && item.name === memberChangeStatus ? (
                                                  <StatusStatic status={tempStatus} />
                                                ) : (
                                                  <StatusStatic status={`${item.pivot.status}`} />
                                                )}
                                            </>
                                          )}
                                        </td>
                                      </>
                                    )}
                                </tr>
                                <br />
                              </>
                            ))}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) }
              <div className="grid grid-cols-2 mx-4">
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8 ">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">ステータス</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <StatusStatic status={taskStatus} />
                    </div>
                  </div>
                </div>
                { infoTask.is_parent !== 1 && (
                  <div className="col-span-1 mx-4 mt-5">
                    <div className="grid grid-cols-8">
                      <div className="layber col-span-2 mx-4">
                        <p className="font-bold text-right">レビュアー</p>
                      </div>
                      <div className="col-span-5 mx-4">
                        <ul className="list__member">
                          {reviewersList.length !== 0 ? (
                            <li>{reviewersList.map((item) => item.name).join(', ')}</li>
                          ) : (
                            <li className="task__chil" />
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                ) }
              </div>

              { infoTask.is_parent !== 1 && (
                <div className=" mx-12 my-5">
                  <p className="font-bold">詳細</p>
                  <div className=" mx-10  demo-infinite-container">
                    <StackEditor value={infoTask.description_of_detail} taskId={idTask} />
                  </div>
                </div>
              ) }
            </div>
            <div>
              {childTask.length > 0 && (
                <Table
                  className="mx-12 mt-5"
                  columns={columns}
                  dataSource={childTask}
                  scroll={{ x: 'max-content', y: '200px' }}
                />
              )}
            </div>
            <Comment
              id={idTask}
              jfInfo={jfInfo}
              statusProp={infoTask.status}
              assigneeProp={assigneeNames}
              category={infoTask.categories}
              parentCallback1={getChildProps1}
              parentCallback2={getChildProps2}
              roleTask={roleTask}
              listMemberAssignee={listMemberAssignee}
            />
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
TaskDetail.middleware = ['auth:superadmin', 'auth:member']
export default TaskDetail
