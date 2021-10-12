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
import OtherLayout from '../../layouts/OtherLayout'
import {
  templateTask,
  beforeTask,
  afterTask,
  deleteTptt,
} from '../../api/template-task'

function templatetTaskDt() {
  const router = useRouter()
  const idTplt = router.query.id
  const [name, setName] = useState('')
  const [categoryName, setCategory] = useState('')
  const [milestoneName, setMilestone] = useState('')
  const [beforeTasks, setBeforeTask] = useState([])
  const [afterTasks, setAfterTasks] = useState([])
  const [ef, setEf] = useState([])
  const [isDay, setIsDay] = useState([])
  const [unit, setUnit] = useState([])
  const [des, setDes] = useState([])
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const { store } = useContext(ReactReduxContext)
  const fetchInfo = async () => {
    await templateTask(idTplt)
      .then((response) => {
        setName(response.data.name)
        setCategory(response.data.categories[0].category_name)
        setMilestone(response.data.milestone.name)
        setEf(response.data.effort)
        setIsDay(response.data.is_day)
        setUnit(response.data.unit)
        setDes(response.data.description_of_detail)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const fetchBeforeTask = async () => {
    await beforeTask(idTplt)
      .then((response) => {
        setBeforeTask(response.data.before_tasks)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const fetchafterTask = async () => {
    await afterTask(idTplt)
      .then((response) => {
        setAfterTasks(response.data.after_tasks)
      })
      .catch((error) => {
        console.log(error)
      })
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
    await deleteTptt(idTplt)
      .then(async (response) => {
        console.log(response.data)
        await router.push('/template-tasks')
        await saveNotification()
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
      onOk: async () => {
        deletetpl()
      },
      onCancel: () => {},
      centered: true,
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  useEffect(() => {
    setUser(store.getState().get('auth').get('user'))
    if (user) {
      setRole(user.get('role'))
    }
    fetchInfo()
    fetchBeforeTask()
    fetchafterTask()
  }, [user])
  const handleBack = () => {
    router.push('/template-tasks')
  }
  const handleEdit = () => {
    router.push(`/template-tasks/${idTplt}/edit`)
  }
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="template-task-dt">
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

            <div className="flex items-center justify-between">
              <h1>テンプレートタスク詳細</h1>
              <div className="button__right mb-5">
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
              <div className="grid grid-cols-2 mx-16 info__center">
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className=" layber col-span-1 mx-4 text-right font-bold">
                      <p>テンプレートタスク名</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      <div className="item__right">{name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className="layber  col-span-1 mx-4 text-right font-bold">
                      <p>カテゴリ</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      <div className="item__right">{categoryName}</div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className="layber col-span-1 mx-4 text-right font-bold">
                      <p>マイルストーン</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      <div className="item__right">{milestoneName}</div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 mx-4 mt-5">
                  <div className="grid grid-cols-3 ">
                    <div className="layber col-span-1 mx-4 text-right font-bold">
                      <p>工数</p>
                    </div>
                    <div className="col-span-2 mx-4">
                      {unit === 'none' ? (
                        <>
                          <span className="ef">{ef}</span>
                          <span className="ef">{isDay ? '日' : '時間'}</span>
                        </>
                      ) : (
                        <>
                          <span className="ef">{ef}</span>
                          <span className="ef">{isDay ? '日' : '時間'}</span>
                          <span>/</span>
                          {unit === 'students' ? (
                            <span className="ef">学生数</span>
                          ) : (
                            <span className="ef">企業数</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 mx-16 mt-5">
                <div className="col-span-1 mx-8 grid grid-cols-3 items-center">
                  <p className="layber col-span-1 mx-5 text-right font-bold">
                    前のタスク
                    {' '}
                  </p>
                  {beforeTasks.length > 0 ? (
                    <>
                      <ul
                        className="list__task col-span-2"
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        {beforeTasks
                          ? beforeTasks.map((item) => (
                            <li className="task__chil">
                              <Tag
                                style={{
                                  marginRight: 3,
                                  paddingTop: '5px',
                                  paddingBottom: '3px',
                                }}
                              >
                                <Tooltip placement="top" title={item.name}>
                                  <a
                                    href={`/template-task-dt/${item.id}`}
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
                    <>
                      <ul className="list__task col-span-2" />
                    </>
                  )}
                </div>
                <div className="col-span-1 mx-8 grid grid-cols-3 items-center">
                  <p className="layber col-span-1 mx-5 text-right font-bold">
                    次のタスク
                  </p>
                  {afterTasks.length > 0 ? (
                    <>
                      <ul
                        className="list__task col-span-2"
                        style={{ border: '1px solid #d9d9d9' }}
                      >
                        {afterTasks
                          ? afterTasks.map((item) => (
                            <li className="task__chil">
                              <Tag
                                style={{
                                  marginRight: 3,
                                  paddingTop: '5px',
                                  paddingBottom: '3px',
                                }}
                              >
                                <Tooltip placement="top" title={item.name}>
                                  <a
                                    href={`/template-task-dt/${item.id}`}
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
                    <>
                      <ul className="list__task col-span-2" />
                    </>
                  )}
                </div>
              </div>

              <div className="mx-16 mt-5">
                <div className=" mx-7 des demo-infinite-container">{des}</div>
              </div>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
templatetTaskDt.middleware = ['auth:superadmin', 'auth:admin', 'auth:member']
export default templatetTaskDt
