import React, { useEffect, useState } from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import { Button, Modal, notification } from 'antd'
import {
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons'

import OtherLayout from '../../layouts/OtherLayout'
import { templateTask, beforeTask, afterTask, deleteTptt } from '../../api/template-task'
import { webInit } from '../../api/web-init'

export default function TaskList() {
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
  const [user, setUser] = useState({})

  const fetchInfo = async () => {
    await templateTask(idTplt).then((response) => {
      setName(response.data.name)
      setCategory(response.data.categories[0].category_name)
      setMilestone(response.data.template_milestone.name)
      setEf(response.data.effort)
      setIsDay(response.data.is_day)
      setUnit(response.data.unit)
      setDes(response.data.description_of_detail)
    }).catch((error) => {
      console.log(error)
    })
  }

  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const fetchBeforeTask = async () => {
    await beforeTask(idTplt).then((response) => {
      setBeforeTask(response.data.before_tasks)
    }).catch((error) => {
      console.log(error)
    })
  }

  const getDataUser = async () => {
    await webInit().then((response) => {
      setUser(response.data.auth.user.role)
      console.log(response.data.auth.user.name)
    }).catch((error) => {
      console.log(error)
    })
  }
  const fetchafterTask = async () => {
    await afterTask(idTplt).then((response) => {
      setAfterTasks(response.data.after_tasks)
    }).catch((error) => {
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
    await deleteTptt(idTplt).then((response) => {
      console.log(response.data)
      saveNotification()
      router.push('/template-tasts')
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
    fetchInfo()
    fetchBeforeTask()
    fetchafterTask()
    getDataUser()
  }, [])
  const handleBack = () => {
    router.push('/template-tasts')
  }
  const handleEdit = () => {
    router.push('/template-tasts')
  }
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="wrapper">
            <div className="list__button">
              <div className="button__left">
                <Button style={{ border: 'none' }} type="primary" onClick={handleBack}>戻る</Button>
              </div>
              <div className="button__right">
                {user === 2 ? (
                  <>
                    <Button style={{ border: 'none' }} type="primary" onClick={handleEdit}>編集</Button>
                    <Button style={{ border: 'none' }} type="primary" onClick={modelDelete}>削除</Button>
                  </>
                )
                  : null}
              </div>
            </div>

            <h1>テンプレートタスク詳細</h1>

            <div className="info__tplt">
              <div className="info__center">
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className=" layber col-span-2 ">
                    <p>テンプレートタスク名:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">{name}</div>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2 " />
                  <div className="layber col-span-2 ">
                    <p>カテゴリ:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">{categoryName}</div>
                  </div>
                  <div className="col-span-2 " />
                </div>

                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>マイルストーン:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="item__right">{milestoneName}</div>
                  </div>
                  <div className="col-span-2 " />
                </div>

                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>リレーション:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="rela">
                      <p>前のタスク </p>
                      <ul className="list__task">
                        {beforeTasks ? beforeTasks.map((item) => (
                          <li className="task__chil">
                            <a href={`/tasks/${item.id}`} target="_blank" rel="noreferrer">
                              {truncate(item.name)}
                            </a>
                          </li>
                        )) : null }
                      </ul>

                    </div>
                    <div className="rela">
                      <p>次のタスク</p>
                      <ul className="list__task">
                        {afterTasks ? afterTasks.map((item) => (
                          <li>
                            <a href={`/tasks/${item.id}`} target="_blank" rel="noreferrer">
                              {truncate(item.name)}
                            </a>
                          </li>
                        )) : null }
                      </ul>
                    </div>
                  </div>
                  <div className="col-span-2 " />
                </div>

                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>工数:</p>
                  </div>
                  <div className="col-span-3">
                    <span className="ef">{ef}</span>
                    <span className="ef">{isDay ? '日' : '時間'}</span>
                    <span>/</span>
                    <span className="ef">{unit}</span>
                  </div>
                  <div className="col-span-2 " />
                </div>
                <div className="grid grid-cols-9 mt-3">
                  <div className="col-span-2" />
                  <div className="layber col-span-2 ">
                    <p>詳細:</p>
                  </div>
                  <div className="col-span-3">
                    <div className="des demo-infinite-container">
                      {des}
                    </div>
                  </div>
                  <div className="col-span-2 " />
                </div>
              </div>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}
