import React, { useEffect, useState } from 'react'
import './style.scss'
import { useRouter } from 'next/router'
import {
  CheckCircleTwoTone, ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Form, Input, Select, Tag, DatePicker, Button, notification, Modal, Tooltip } from 'antd'
import moment from 'moment'
import JfLayout from '../../layouts/layout-task'
import {
  taskData, beforeTask, afterTask, getUser,
} from '../../api/task-detail'
import { jftask } from '../../api/jf-toppage'
import * as Extensions from '../../utils/extensions'
import { webInit } from '../../api/web-init'
import { editTask } from '../../api/edit-task'

export default function TaskList() {
  const dateFormat = 'YYYY/MM/DD'
  const { TextArea } = Input
  const router = useRouter()
  const idTask = router.query.id
  const [form] = Form.useForm()
  const [disableBtn, setdisableBtn] = useState(false)
  const [beforeTasksNew, setBeforeTaskNew] = useState([])
  const [listUser, setListUser] = useState([])
  const [allTask, setAllTask] = useState([])
  const [afterTasksNew, setafterTaskNew] = useState([])
  const [users, setUsers] = useState({
    id: null,
    name: '',
    role: '',
  })
  const [infoTask, setInfoTask] = useState({
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
  const [idJF, setIdJF] = useState(null)
  const fetchTaskData = async () => {
    await taskData(idTask)
      .then((response) => {
        setInfoTask({
          name: response.data.name,
          categories: response.data.categories[0].category_name,
          milestone: response.data.milestone.name,
          status: response.data.status,
          start_time: response.data.start_time,
          end_time: response.data.end_time,
          effort: response.data.template_task.effort,
          is_day: response.data.template_task.is_day,
          unit: response.data.template_task.unit,
          description_of_detail: response.data.description_of_detail,
        })

        setIdJF(
          response.data.schedule.jobfair.id,

        )
        // eslint-disable-next-line no-use-before-define
        fetchListTask()
        const listmember = []
        response.data.users.forEach((element) => {
          listmember.push(element.name)
        })
        form.setFieldsValue({
          name: response.data.name,
          category: response.data.categories[0].category_name,
          milestone: response.data.milestone.name,
          assignee: listmember,
          status: response.data.status,
          start_time: moment(response.data.start_time.split('-').join('/'), dateFormat),
          end_time: moment(response.data.end_time.split('-').join('/'), dateFormat),
          detail: response.data.description_of_detail,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const startDayValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    return Promise.resolve()
  }
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const tagRender = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
      >
        <Tooltip title={label}>
          <span
            onClick={() => {
              const id = allTask.find((e) => e.name === value)
              router.push(`/task-detail/${id.id}`)
            }}
            className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"

          >
            {truncate(label)}
            {/* <a href="" className="my-1">{label}</a> */}
          </span>

        </Tooltip>
      </Tag>
    )
  }

  const tagRenderr = (props) => {
    // eslint-disable-next-line react/prop-types
    const { label, value, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, paddingTop: '5px', paddingBottom: '3px' }}
      >
        <Tooltip title={label}>
          <span
            className="inline-block text-blue-600 cursor-pointer whitespace-nowrap overflow-hidden"

          >
            {label}
            {/* <a href="" className="my-1">{label}</a> */}
          </span>

        </Tooltip>
      </Tag>
    )
  }
  const filtedArr = () => {
    const before = form.getFieldsValue().beforeTasks
    const after = form.getFieldsValue().afterTasks
    let selectedItems = []
    if (before && !after) {
      selectedItems = [...selectedItems, ...before]
    } else if (!before && after) {
      selectedItems = [...selectedItems, ...after]
    } else if (before && after) {
      selectedItems = [...before, ...after]
    }
    const filted = allTask.filter((e) => !selectedItems.includes(e.name))
    setBeforeTaskNew(filted)
    setafterTaskNew(filted)
    return filted
  }
  const TaskNameValidator = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('この項目は必須です'))
    }
    if (value.match(Extensions.Reg.specialCharacter)) {
      return Promise.reject(new Error('使用できない文字が含まれています'))
    }
    if (value.match(Extensions.Reg.vietnamese)) {
      return Promise.reject(new Error('ベトナム語は入力できない'))
    }
    if (value.match(Extensions.Reg.onlyNumber)) {
      return Promise.reject(new Error('数字のみを含めることはできない'))
    }

    return Promise.resolve()
  }
  const onValueNameChange = (e) => {
    form.setFieldsValue({
      name: e.target.value,
    })
  }
  const getDataUser = async () => {
    await webInit().then((response) => {
      setUsers({

        id: response.data.auth.user.id,
        name: response.data.auth.user.name,
        role: response.data.auth.user.role,

      })
      console.log(response.data.auth.user.role)
    }).catch((error) => {
      console.log(error)
    })
  }
  const saveNotification = () => {
    notification.open({
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
      message: '変更は正常に保存されました。',
      onClick: () => {},
    })
  }
  const onFinishSuccess = async (values) => {
    try {
      const beforeID = []
      const afterIDs = []
      const adminas = []
      if (values.taskBefore && values.afterTask) {
      // eslint-disable-next-line array-callback-return
        allTask.map((e) => {
          if (values.taskBefore.includes(e.name)) {
            beforeID.push(e.id)
          }
          if (values.afterTask.includes(e.name)) {
            afterIDs.push(e.id)
          }
        })
      }
      if (values.assignee) {
        listUser.map((e) => {
          if (values.assignee.includes(e.name)) {
            adminas.push(e.id)
          }
          return ''
        })
      }

      const data = {
        name: values.name,
        description_of_detail: values.detail,
        beforeTasks: beforeID,
        afterTasks: afterIDs,
        start_time: values.start_time.format(Extensions.dateFormat),
        end_time: values.end_time.format(Extensions.dateFormat),
        admin: adminas,
        user_id: users.id,
        status: values.status,

      }
      setdisableBtn(true)
      console.log(data)
      await editTask(idTask, data).then((response) => {
        saveNotification()
        console.log(response.data)
        router.push(`/task-detail/${idTask}`)
      }).catch((error) => {
        console.log(error)
        setdisableBtn(false)
      })
      setdisableBtn(true)
    } catch (error) {
      setdisableBtn(false)
      return error
    }

    return ''
  }
  const onFinishFailed = (errorInfo) => errorInfo
  const cancelConfirmModle = () => {
    Modal.confirm({
      title: '変更内容が保存されません。よろしいですか？',
      icon: <ExclamationCircleOutlined />,
      content: '',
      centered: true,
      onOk: () => {
        router.push('/tasks')
      },

      onCancel: () => {},
      okText: 'はい',
      cancelText: 'いいえ',
    })
  }
  const fetchBeforeTask = async () => {
    await beforeTask(idTask)
      .then((response) => {
        const listbfTask = []
        response.data.before_tasks.forEach((element) => {
          listbfTask.push(element.name)
        })
        form.setFieldsValue({
          taskBefore: listbfTask,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const fetchafterTask = async () => {
    await afterTask(idTask).then((response) => {
      const listatTask = []
      response.data.after_tasks.forEach((element) => {
        listatTask.push(element.name)
      })
      console.log(listatTask)
      form.setFieldsValue({
        afterTask: listatTask,
      })
    }).catch((error) => {
      console.log(error)
    })
  }
  const fetchListTask = async () => {
    await jftask(idJF).then((response) => {
      setAllTask(response.data.schedule.tasks)
      setBeforeTaskNew(response.data.schedule.tasks)
      setafterTaskNew(response.data.schedule.tasks)
    }).catch((error) => {
      console.log(error)
    })
  }
  const fetchListMember = async () => {
    await getUser().then((response) => {
      setListUser(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    fetchTaskData()
    fetchBeforeTask()
    fetchafterTask()
    getDataUser()
    fetchListTask()
    fetchListMember()
  }, [idJF])
  const listStatus = ['未着手', '進行中', '完了', '中断', '未完了']
  return (
    <div>
      <JfLayout id={idJF}>
        <JfLayout.Main>
          <h1>タスク編集 </h1>
          <div className="edit-task">
            <Form
              form={form}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
              }}
              layout="horizontal"
              colon={false}
              initialValues={{ defaultInputValue: 0 }}
              onFinish={onFinishSuccess}
              onFinishFailed={onFinishFailed}
            >
              <div className="grid grid-cols-2 mx-10">
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="タスク名:"
                    name="name"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="タスク名入力する"
                      maxLength={20}
                      onChange={onValueNameChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="カテゴリ:"
                    name="category"
                  >
                    <span>{infoTask.categories}</span>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="マイルストーン:"
                    name="milestone"
                  >
                    <span>{infoTask.milestone}</span>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <div className="ef-label">
                    <div className="laybel">
                      <span>工数:</span>
                    </div>
                    <div className="row-ef">
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
                          <span className="ef">{infoTask.unit}</span>
                        </>
                      ) }
                    </div>
                  </div>

                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="担当者:"
                    name="assignee"
                    required
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRenderr}
                      style={{ width: '100%' }}
                    >
                      {listUser.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>

                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    label="ステータス:"
                    name="status"
                    required
                    rules={[
                      {
                        validator: TaskNameValidator,
                      },
                    ]}
                  >
                    <Select className="addJF-selector" placeholder="管理者を選択">
                      {listStatus.map((element) => (
                        <Select.Option value={element}>
                          {element}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="start_time"
                    label="開始日:"
                    required
                    className="big-icon"
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>

                </div>
                <div className="col-span-1 mx-4">
                  <Form.Item
                    name="end_time"
                    className="big-icon"
                    label="終了日:"
                    required
                    rules={[
                      {
                        validator: startDayValidator,
                      },
                    ]}
                  >
                    <DatePicker
                      help="Please select the correct date"
                      format={Extensions.dateFormat}
                      placeholder={Extensions.dateFormat}
                    />
                  </Form.Item>

                </div>
                <div className="col-span-1 mx-4">

                  <Form.Item
                    label="前のタスク:"
                    name="taskBefore"
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      onChange={filtedArr}
                    >
                      {beforeTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>

                  </Form.Item>
                </div>
                <div className="col-span-1 mx-4">

                  <Form.Item
                    label="次のタスク:"
                    name="afterTask"
                  >
                    <Select
                      mode="multiple"
                      showArrow
                      tagRender={tagRender}
                      style={{ width: '100%' }}
                      onChange={filtedArr}
                    >
                      {afterTasksNew.map((element) => (
                        <Select.Option key={element.id} value={element.name}>
                          {element.name}
                        </Select.Option>
                      ))}
                    </Select>

                  </Form.Item>
                </div>
                <div className="col-span-2 mx-4">
                  <Form.Item
                    name="detail"
                  >
                    <TextArea rows={10} placeholder="何かを入力してください" />
                  </Form.Item>
                </div>
              </div>
              <div className="flex justify-end mr-11">
                <Form.Item
                  label=" "
                  className=" "
                >
                  <div className="flex ">
                    <Button
                      htmlType="button"
                      type="primary"
                      onClick={cancelConfirmModle}
                      disabled={disableBtn}
                      className="button_cacel mx-3"
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disableBtn}
                      loading={disableBtn}
                    >
                      保存
                    </Button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>
        </JfLayout.Main>
      </JfLayout>
    </div>
  )
}
