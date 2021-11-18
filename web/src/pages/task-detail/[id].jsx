/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { DeleteTwoTone, EditTwoTone, ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, notification, Tag, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ReactReduxContext } from 'react-redux'
import { afterTask, beforeTask, deleteTask, taskData } from '~/api/task-detail'
import Comment from '~/components/comment/index'
import Loading from '~/components/loading'
import JfLayout from '~/layouts/layout-task'
import { reviewers } from '../../api/edit-task'
import MarkDownView from '../../components/markDownView'
import './style.scss'

function TaskDetail() {
  const router = useRouter()
  const idTask = router.query.id
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
  const [newAsigneesFromNewComment, setNewAsigneesFromNewComment] = useState([])
  const [taskStatus, setTaskStatus] = useState(infoTask.status)
  const [infoJF, setInfoJF] = useState({
    id: null,
    name: '',
  })
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
  const getChildProps = useCallback((childState) => {
    const copyState = {}
    Object.assign(copyState, childState)
    console.log(childState)
    console.log(copyState.new_assignees.length)
    console.log(listMemberAssignee)

    if (copyState.new_assignees.length > 0) {
      setNewAsigneesFromNewComment(copyState.new_assignees)
    }
    if (copyState.new_status !== '') {
      setTaskStatus(copyState.new_status)
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
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const fetchTaskData = async () => {
    await taskData(idTask).then((response) => {
      if (response.status === 200) {
        const data = response.data
        getRole(data.schedule.jobfair.jobfair_admin_id)
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
        setTaskStatus(data.status)
        console.log(data.users)
        setListMemberAssignee(data.users)
        setInfoJF({
          id: data.schedule.jobfair.id,
          name: data.schedule.jobfair.name,
        })
      }
    }).catch(() => {
      router.push('/error')
    })
  }
  const fetchBeforeTask = async () => {
    await beforeTask(idTask).then((response) => {
      setBeforeTask(response.data.before_tasks)
    })
  }
  const fetchAfterTask = async () => {
    await afterTask(idTask).then((response) => {
      setAfterTasks(response.data.after_tasks)
    })
  }
  const [reviewersList, setReviewersList] = useState([])
  const fetchReviewersList = async () => {
    await reviewers(idTask).then((response) => {
      setReviewersList(response.data)
    }).catch(() => {
      router.push('/error')
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

  useEffect(() => {
    setLoading(true)
    fetchTaskData()
    fetchBeforeTask()
    fetchAfterTask()
    fetchReviewersList()
    setLoading(false)
  }, [role])
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
                {role === 'admin' ? (
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
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">担当者</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <ul className="list__member">
                        {newAsigneesFromNewComment.length > 0
                          ? newAsigneesFromNewComment
                            && newAsigneesFromNewComment.map((item, index) => {
                              const id = index + item
                              return <li key={id} className="task__chil">{`${item},`}</li>
                            })
                          : listMemberAssignee
                            && listMemberAssignee.map((item) => (
                              <li key={item.id} className="task__chil">{`${item.name},`}</li>
                            ))}
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
                      {taskStatus === '未着手' ? (
                        <span
                          style={{ background: '#5EB5A6', color: '#fff' }}
                          className=" stt item__right"
                        >
                          {taskStatus}
                        </span>
                      ) : null}
                      {taskStatus === '進行中' ? (
                        <span
                          style={{ background: '#A1AF2F', color: '#fff' }}
                          className=" stt item__right"
                        >
                          {taskStatus}
                        </span>
                      ) : null}
                      {taskStatus === '完了' ? (
                        <span
                          style={{ background: '#4488C5', color: '#fff' }}
                          className=" stt item__right"
                        >
                          {taskStatus}
                        </span>
                      ) : null}
                      {taskStatus === '中断' ? (
                        <span
                          style={{
                            background: 'rgb(185, 86, 86)',
                            color: '#fff',
                          }}
                          className=" stt item__right"
                        >
                          {taskStatus}
                        </span>
                      ) : null}
                      {taskStatus === '未完了' ? (
                        <span
                          style={{
                            background: 'rgb(121, 86, 23)',
                            color: '#fff',
                          }}
                          className=" stt item__right"
                        >
                          {taskStatus}
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
                  {beforeTasks?.length > 0 ? (
                    <>
                      <ul className="list__task col-span-5" style={{ border: '1px solid #d9d9d9' }}>
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
                  {afterTasks?.length > 0 ? (
                    <>
                      <ul className="list__task col-span-5" style={{ border: '1px solid #d9d9d9' }}>
                        {afterTasks
                          && afterTasks.map((item) => (
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
                          ))}
                      </ul>
                    </>
                  ) : (
                    <ul className="list__task col-span-6" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 mx-4">
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-8">
                    <div className="layber col-span-2 mx-4">
                      <p className="font-bold text-right">レビュアー</p>
                    </div>
                    <div className="col-span-5 mx-4">
                      <ul className="list__member">
                        {reviewersList.length !== 0 ? (
                          reviewersList.map((item) => (
                            <li key={item.id} className="task__chil">{`${item.name},`}</li>
                          ))
                        ) : (
                          <li className="task__chil">None</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-12 mt-5">
                <div className=" mx-10 des demo-infinite-container">
                  <MarkDownView source={infoTask.description_of_detail} />
                </div>
              </div>
            </div>
            <Comment
              id={idTask}
              statusProp={infoTask.status}
              assigneeProp={assigneeNames}
              category={infoTask.categories}
              parentCallback={getChildProps}
            />
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
TaskDetail.middleware = ['auth:superadmin', 'auth:member']
export default TaskDetail
